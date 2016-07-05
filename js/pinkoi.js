document.addEventListener('DOMContentLoaded', function() {
  var itemMap = {};
  var preItemMap = {};
  for(page = 1 ; page <= 100 ; page++ ){
    $.get("http://www.pinkoi.com/browse/紙膠帶-文具卡片?category=3&subcategory=310&page="+page, function(result){
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(result,"text/html");
        x = xmlDoc.getElementsByClassName("item g-fav-wrap");
        var _s = "";
        for (i = 0; i < x.length; i++) {
          if(x[i].childNodes.length == 9){
            var _href = "http://www.pinkoi.com/"+x[i].getElementsByTagName("a")[0].getAttribute("href");
            var _name = x[i].getElementsByTagName("div")[0].childNodes[0].text;
            var _owner = x[i].getElementsByClassName("owner")[0].childNodes[1].textContent;
            var _img = "http:"+x[i].getElementsByTagName("img")[0].getAttribute("data-src");
            var _msg = x[i].getElementsByClassName("g-item-badge")[0].childNodes[0].textContent;
            _s = "<li title='"+_owner+"'><div title='"+_owner+"' class='ch-item' style='background-image: url(\""+_img+"\")'><div class='ch-info'><h3>"+_msg+"</h3><p><a href='"+_href+"' target='_blank'>"+_name+"</a></p></div></div></li>";
            if(parseInt(_msg.replace ( /[^\d.]/g, '' ))){
              discount = parseInt(_msg.replace ( /[^\d.]/g, '' ),10);
              discount = discount<10? discount*10 : discount;
              discount = parseInt(discount/10);
              if(discount==9){
                $(_s).appendTo("#tag9Li"); 
              }else if(discount==8){
                $(_s).appendTo("#tag8Li"); 
              }else if(discount==7){
                $(_s).appendTo("#tag7Li"); 
              }else if(discount==6){
                $(_s).appendTo("#tag6Li"); 
              }else{
                $(_s).appendTo("#tag5Li"); 
              }
            }else{
              $(_s).appendTo("#tag0Li");  
            }


            if(_owner in itemMap){
              itemMap[_owner]+=1;
            }else{
              itemMap[_owner]=1;
            }
          }
        }

      // sortMap = SortMapFunc(itemMap);
      // if(preItemMap.length<itemMap.length){
      //   preItemMap = itemMap;
      // }else{
      // }

        if(x.length==0){
          SortMapFunc(itemMap);
          page=999;
        }
    });
  }
});

function compare(a,b) {
  if (a.last_nom < b.last_nom)
    return -1;
  if (a.last_nom > b.last_nom)
    return 1;
  return 0;
}


function SortMapFunc(itemMap){
  keysSorted = Object.keys(itemMap).sort(function(a,b){return itemMap[b]-itemMap[a]})
  _S='<button id="bt_all" type="button" class="owner_Btn btn btn-default btn-sm btn-block active" alt="all">全部</button>';
  for(owner in keysSorted){
    _S += '<button id="bt_'+owner+'" type="button" class="owner_Btn btn btn-default btn-sm btn-block" alt="'+keysSorted[owner]+'" >'+keysSorted[owner]+'</button>';
  }
  $("#ownerBar").html(_S);
  // $("#ownerBar").html(_S).click(function() {
  //   alert($(this).attr("id"));
  // });;
  // return keysSorted;
}

function filterOwner(owner){
}

$(function(){
  $("#ownerBar").on("click" , "button.owner_Btn", function(){
    thisID = $(this).attr('id');
    alt = $("#"+thisID).attr("alt");
    if(thisID=="bt_all"){
      if($("#bt_all").hasClass( "active" )){
        $("#"+thisID).removeClass("active");
        $("div.tab-pane li").css("display","none");
      }else{
        $("button.owner_Btn").removeClass("active");
        $("#"+thisID).addClass("active");
        $("div.tab-pane li").css("display","inline-block");
      }
    }else{
      if($("#"+thisID).hasClass( "active" )){
        $("div.tab-pane li").each( function(i,v){
          if($(v).attr("title")==alt){
            $(v).css("display","none");
          }
        });
        $("#"+thisID).removeClass("active");
      }else{
        $("#"+thisID).addClass("active");
        $("div.tab-pane li").each( function(i,v){
          if($(v).attr("title")==alt){
            $(v).css("display","inline-block");
          }
        });
        // console.log("div.tab-pane li div[alt='"+alt+"']");
      }
    }
  });
})
