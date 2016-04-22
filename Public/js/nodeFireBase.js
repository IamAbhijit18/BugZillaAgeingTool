var ListienMyFireBaseEvents = function () {
    var refMyFireBase;
    var viewModel = [];
    var init = function (callBack) {
        refMyFireBase = new Firebase("https://iothome.firebaseio.com/");
        GetAllSchema(callBack);
    };

    var listinToChage = function (rootName, ChildName, callBack) {
        var path = "" + rootName + "/" + ChildName + "";
        var ref = refMyFireBase.child(path);
        ref.on("value", function (snapshot) {
            console.log(snapshot.val());
            var returnObj = {
                RootName: rootName,
                ChildName: ChildName,
                Path: path,
                Value: snapshot.val()
            }
            callBack(returnObj);
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    };

    var GetAllSchema = function (callback) {
        
        refMyFireBase.once("value", function (snapshot) {
            
            //console.log("length "+ snapshot.lastIndexOf(0));
            
            snapshot.forEach(function (childSnapshot) {
                
                var obj =  {
                    Key :  childSnapshot.key(),
                    ChildData : childSnapshot.val()
                } 
                viewModel.push(obj) ;
                console.log("Push" +obj.Key + "---"+childSnapshot.val() )
                callback(obj);
            });
        });
    }

    return {
        init: init,
        listinToChage: listinToChage,
        viewModel:viewModel
    }

}

module.exports = ListienMyFireBaseEvents;