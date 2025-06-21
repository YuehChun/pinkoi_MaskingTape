/**
 * jQuery AJAX Security Patch
 * Fixes cross-origin script execution vulnerability and implements additional security measures
 * 
 * This patch addresses:
 * 1. CVE-2015-9251: Cross-origin script execution vulnerability
 * 2. Implements secure AJAX defaults
 * 3. Adds content type validation
 * 4. Prevents automatic script evaluation
 */

(function($) {
    'use strict';
    
    // Store original ajax method
    var originalAjax = $.ajax;
    
    // Security configuration
    var securityConfig = {
        // Allowed content types for automatic processing
        allowedContentTypes: [
            'text/html',
            'text/plain',
            'application/json',
            'text/json',
            'application/xml',
            'text/xml'
        ],
        
        // Blocked content types that could execute scripts
        blockedContentTypes: [
            'text/javascript',
            'application/javascript',
            'application/x-javascript'
        ],
        
        // Default secure settings
        secureDefaults: {
            cache: false,
            processData: true,
            ifModified: false,
            global: true
        }
    };
    
    // Override jQuery.ajax with security enhancements
    $.ajax = function(url, options) {
        // Handle overloaded arguments
        if (typeof url === "object") {
            options = url;
            url = undefined;
        }
        options = options || {};
        
        // Apply secure defaults
        options = $.extend({}, securityConfig.secureDefaults, options);
        
        // Force dataType for cross-origin requests to prevent script execution
        if (options.crossDomain !== false && !options.dataType) {
            // Default to 'html' for cross-origin requests to prevent script execution
            options.dataType = 'html';
        }
        
        // Block dangerous content types
        var originalSuccess = options.success;
        options.success = function(data, textStatus, jqXHR) {
            var contentType = jqXHR.getResponseHeader('Content-Type') || '';
            
            // Check if response content type is potentially dangerous
            for (var i = 0; i < securityConfig.blockedContentTypes.length; i++) {
                if (contentType.toLowerCase().indexOf(securityConfig.blockedContentTypes[i]) !== -1) {
                    console.warn('jQuery Security: Blocked potentially dangerous content type:', contentType);
                    // Don't execute the original success callback with potentially dangerous content
                    return;
                }
            }
            
            // Safe to proceed with original success handler
            if (originalSuccess) {
                originalSuccess.call(this, data, textStatus, jqXHR);
            }
        };
        
        // Enhanced error handling
        var originalError = options.error;
        options.error = function(jqXHR, textStatus, errorThrown) {
            // Log security-related errors
            if (textStatus === 'blocked') {
                console.error('jQuery Security: Request blocked due to security policy');
            }
            
            if (originalError) {
                originalError.call(this, jqXHR, textStatus, errorThrown);
            }
        };
        
        // Call original ajax with secured options
        return originalAjax.call(this, url, options);
    };
    
    // Override jQuery.get to ensure security
    var originalGet = $.get;
    $.get = function(url, data, success, dataType) {
        // Force dataType for cross-origin requests
        if (!dataType && typeof data === 'function') {
            success = data;
            data = undefined;
            dataType = 'html'; // Safe default
        } else if (!dataType) {
            dataType = 'html'; // Safe default
        }
        
        return $.ajax({
            url: url,
            type: 'GET',
            dataType: dataType,
            data: data,
            success: success
        });
    };
    
    // Override jQuery.post with same security measures
    var originalPost = $.post;
    $.post = function(url, data, success, dataType) {
        if (!dataType && typeof data === 'function') {
            success = data;
            data = undefined;
            dataType = 'html'; // Safe default
        } else if (!dataType) {
            dataType = 'html'; // Safe default
        }
        
        return $.ajax({
            url: url,
            type: 'POST',
            dataType: dataType,
            data: data,
            success: success
        });
    };
    
    // Disable automatic script evaluation for specific scenarios
    var originalGlobalEval = $.globalEval;
    $.globalEval = function(code, options) {
        // Add security check
        if (typeof code !== 'string' || !code.trim()) {
            return;
        }
        
        // Log potential security issue
        console.warn('jQuery Security: globalEval called. Code:', code.substring(0, 100) + '...');
        
        // Only proceed if explicitly allowed
        if (options && options.allowUnsafe === true) {
            return originalGlobalEval.call(this, code, options);
        } else {
            console.warn('jQuery Security: globalEval blocked for security. Use {allowUnsafe: true} if intentional.');
        }
    };
    
    console.log('jQuery Security Patch applied successfully');
    
})(jQuery);
