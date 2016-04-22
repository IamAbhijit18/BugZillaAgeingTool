var module = { };

 module.view = (function(){
    var refMyFireBase ;
    var viewModel =  {
              "Kitchen" : {
                            "Lamp1" : "ON",
                            "Lamp2" : "OFF"
  }
};
    var init = function(){
        console.log('Ente');
        refMyFireBase =  new Firebase("https://iothome.firebaseio.com/"); 
        listinToChage("Kitchen","Lamp1");
        listinToChage("Kitchen","Lamp2");
    };
    
    var clickEvent = function(id,rootName,ChildName,val){
       console.log('click');
       
        var path = ""+rootName+"/"+ChildName+"";
        debugger;
        var ref = refMyFireBase.child(path);
        var idvalue = $("#"+id).text();
        ref.set(val);
    };
    
    var logResult = function(msg){
        console.log(msg);
    };
    
    var listinToChage = function (rootName,ChildName)
    {
        var path = ""+rootName+"/"+ChildName+"";
        var ref = refMyFireBase.child(path);
        ref.on("value", function(snapshot) {
            console.log(snapshot.val());
            return snapshot.val();
       }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    };
    
    return {
        init:init,
        clickEvent:clickEvent,
        logResult:logResult,
        listinToChage:listinToChage
    }
})();

//module.exports = module.view;