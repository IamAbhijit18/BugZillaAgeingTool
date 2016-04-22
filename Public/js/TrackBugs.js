var module = {};
var myFireBase;
var listOfIds = [];
module.TrackBugs = (function () {

    var dataBaseDataRef;
    var target_Sprint = [];
    var product = [];
    var userName ;
    var Password ;



    var rehabBugListViewModel = {
        bugsAssigned: [

      ],
        bugsQA: [

      ],
        bugsReady: [

      ],
        bugsUnAssigned: [],
        UAT: [],
        ProductionTickets: [],
        BugNotAssigned: [],
        ProductionSupport: [],
        AssignedProductionTickets: []
    };


    var init = function () {

        // refMyFireBase = new Firebase("https://bugzillatrack.firebaseio.com/");
        //GetBugListFromDataBaseFirstTime("Rehab", "BugList");
        splitAndAdd();


        //var dummyData =  [{id:58661}, {id: 58662}, {id: 91967}, { id:93899}, {id:95387}, {id:95250} ];

        //PostJSONData(dummyData,"Rehab");

        connectBugzilla();
        repeateCheck();
    };
var connectMeNow =  function()
{   $("#mgsPanel").hide();
    $("#error").hide();
 
    connectBugzilla();
};
    var splitAndAdd = function () {
        product = [];
        target_Sprint = [];

        var splt = $("#target_milestone").val().split(',');
        _.each(splt, function (data) {
            target_Sprint.push(data.toString());
        });

        var splt1 = $("#product").val().split(',');
        _.each(splt1, function (data) {
            product.push(data.toString());
        });



    };

    var repeateCheck = function () {
        setInterval(connectBugzilla, 10000);
    };

    var PostJSONData = function (json, projectName) {
        var jsonData = [];
        _.each(json, function (data) {
            var prop = {
                id: data.id

            }

            jsonData.push(prop);
        });

        PostViewModel(projectName, "BugList", json);
    };

    var onclickSet = function () {
        splitAndAdd();
        connectBugzilla();
    }

    var CreateViewModelFromSnapShot = function (data) {
            listOfIds = [];
            _.each(data, function (item) {


                listOfIds.push(item)
                    //console.log(iteratee);
            });


        }
        //rootName : ProjectName 
        //ChildName : BugList
    var PostViewModel = function (rootName, ChildName, data) {
        var path = "" + rootName + "/" + ChildName + "";
        var ref = refMyFireBase.child(path);
        ref.set(data);
    };

    var GetBugListFromDataBaseFirstTime = function (rootName, ChildName) {
        var path = "" + rootName + "/" + ChildName + "";
        var ref = refMyFireBase.child(path);
        ref.on("value", function (snapshot) {
            listOfIds = [];
            dataBaseDataRef = snapshot.val();
            _.each(snapshot.val(), function (item) {
                listOfIds.push(item.id);
            });


            //connectBugzilla();
        });
    };


    var dataMapp = function (data) {
        var obj = {
            id: data.id,
            status: data.status,
            assigned_to: data.assigned_to,
            summary: data.summary,
            devStartDate: '12/10/2016',
            devExpectedEndDate: '12/10/2016',
            bugFixedDate: '12/10/2016',
            bugVerifiedDate: '12/10/2016',
            redColor: true,
            emberColor: false,
            greenColor: false,
            AssignedOn: data.last_change_time != undefined ? data.last_change_time.split('T')[0] : null,
            Creationtime: data.creation_time != undefined ? data.creation_time.split('T')[0] : null,
            CreationtimeDateFormat: data.creation_time != undefined ? new Date(new Date(data.creation_time.split('T')[0]).setHours(0, 0, 0, 0)) : null



        }

        return obj;
    }

    var setColorBasedOnCondition = function (data) {

        _.each(data, function (dt) {
            _.each(dt.Value, function (item) {

                var today = new Date();
                today.setHours(0, 0, 0, 0);

                var date = new Date(item.AssignedOn);
                var newdate2 = new Date(date);
                var newdate5 = new Date(date);
                newdate2.setDate(newdate2.getDate() + 2);
                newdate5.setDate(newdate5.getDate() + 5);

                newdate2.setHours(0, 0, 0, 0);
                newdate5.setHours(0, 0, 0, 0);
                if (today >= newdate2 && today < newdate5) {


                    item.redColor = false;
                    item.emberColor = true;

                } else if (today >= newdate5) {

                    item.redColor = true;
                    item.emberColor = false;
                } else {
                    item.redColor = false;
                    item.emberColor = false;
                }



            });
        });

        return data;

    }

    var groupByName = function (data) {
        var uniqueAssigneNames = [];
        var orderByName = [];
        _.each(data, function (item) {

            if (!_.contains(uniqueAssigneNames, item.assigned_to)) {
                uniqueAssigneNames.push(item.assigned_to);
            }

        });
        _.each(uniqueAssigneNames, function (name) {

            var obj = {
                Name: name,
                Value: _.where(data, {
                    assigned_to: name
                })
            }

            orderByName.push(obj);
        });


        return orderByName;
    };

    var todaysBugWithGroupByName = function (data) {
        var uniqueAssigneNames = [];
        var orderByName = [];
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var newdate2 = new Date(today);
        newdate2.setDate(newdate2.getDate() - 1);
        var objectData = [];

        _.each(data, function (name) {

            if (name.CreationtimeDateFormat >= newdate2 && name.CreationtimeDateFormat <= today) {
                objectData.push(name);
            }
        });



        _.each(objectData, function (item) {

            if (!_.contains(uniqueAssigneNames, item.assigned_to)) {

                uniqueAssigneNames.push(item.assigned_to);
            }

        });
        _.each(uniqueAssigneNames, function (name) {

            var obj = {
                Name: name,
                Value: _.where(objectData, {
                    assigned_to: name
                })
            }

            orderByName.push(obj);
        });


        return orderByName;
    };

    var buildViewModel = function (arryOfbugs) {
        rehabBugListViewModel.bugsAssigned = [];
        rehabBugListViewModel.bugsQA = [];
        rehabBugListViewModel.bugsReady = [];

        rehabBugListViewModel.BugNotAssigned = []
        _.each(arryOfbugs, function (data) {



            if (data.status.toLocaleLowerCase() == "resolved") {

                rehabBugListViewModel.bugsQA.push(dataMapp(data));


            } else if (data.status.toLocaleLowerCase() == "assigned" || data.status.toLocaleLowerCase() == "reopned") {
                rehabBugListViewModel.bugsAssigned.push(dataMapp(data));
            } else if (data.status.toLocaleLowerCase() == "verified") {

                rehabBugListViewModel.bugsReady.push(dataMapp(data));

            } else {
                rehabBugListViewModel.BugNotAssigned.push(dataMapp(data));

            }



        });


        $("#mgsPanel").hide();
        $("#bugAssignedList").empty();
        if (rehabBugListViewModel.bugsAssigned.length > 0) {
            $('#bugBugTmp').tmpl(setColorBasedOnCondition(groupByName(rehabBugListViewModel.bugsAssigned))).appendTo('#bugAssignedList');

        } else {
            $('#bugAssignedList').text("No data to view");
        }



        $("#VerifiedbugList").empty();
        $('#ReadybugBugTmp').tmpl(setColorBasedOnCondition(groupByName(rehabBugListViewModel.bugsReady))).appendTo('#VerifiedbugList');

        $("#QAbugList").empty();
        $('#QAbugBugTmp').tmpl(setColorBasedOnCondition(groupByName(rehabBugListViewModel.bugsQA))).appendTo('#QAbugList');




        $("#displayData").show();

        // PostJSONData(rehabBugListViewModel, "Rehab");

    }
    var getproductionTicket = function () {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var newdate2 = new Date(today);
        newdate2.setDate(newdate2.getDate() - 1);

        var params = [{
            /* The authentication parameters */
            "Bugzilla_login": $("#userName").val(),
            "Bugzilla_password": $("#pwd").val(),
            /* The actual method parameters */

            "product": product,
            "status": ["NEW", "REOPNED", "ASSIGNED"]
                //"remember": "True"
            }];

        var myObject = {
            "method": "Bug.search",
            "params": JSON.stringify(params)
        };

        $.ajax({
            "contentType": "application/json",
            "data": myObject,
            /* jQuery will handle URI encoding */
            "crossDomain": "true",
            "dataType": "jsonp",
            /* jQuery will handle adding the 'callback' parameter */
            "url": "https://bugzilla.emids.com/jsonrpc.cgi",
            "type": "GET",
            success: function (data) {

                if (data.result != null) {

                    rehabBugListViewModel.ProductionTickets = [];
                    rehabBugListViewModel.UAT = [];
                    rehabBugListViewModel.ProductionSupport = [];
                    rehabBugListViewModel.AssignedProductionTickets = [];

                    _.each(data.result.bugs, function (data) {
                        if (data.component == "Production Tickets") {
                            console.log(data);
                            rehabBugListViewModel.ProductionTickets.push(dataMapp(data));
                            //rehabBugListViewModel.BugNotAssigned.push(dataMapp(data));
                            if (data.status == "ASSIGNED" || data.status == "REOPNED") {
                                console.log(data);
                                rehabBugListViewModel.AssignedProductionTickets.push(dataMapp(data));
                            } else {
                                if (data.target_milestone == "---") {
                                    console.log("---2");
                                    rehabBugListViewModel.BugNotAssigned.push(dataMapp(data));
                                }

                            }

                            rehabBugListViewModel.AssignedProductionTickets

                        } else if (data.component == "Production Support") {
                            rehabBugListViewModel.ProductionSupport.push(dataMapp(data));
                            if (data.target_milestone == "---") {
                                console.log("---1");
                                rehabBugListViewModel.BugNotAssigned.push(dataMapp(data));
                            }

                        } else if (data.creator.split('@')[1].toLocaleLowerCase() == "lcca.com") {
                            rehabBugListViewModel.UAT.push(dataMapp(data));
                            if (data.target_milestone == "---") {
                            rehabBugListViewModel.BugNotAssigned.push(dataMapp(data));
                            }
                            

                        } else {
                            //rehabBugListViewModel.BugNotAssigned.push(dataMapp(data));
                        }

                    });
                    $("#ticketNew").empty();
                    $('#ticketTmp').tmpl(setColorBasedOnCondition(todaysBugWithGroupByName(rehabBugListViewModel.ProductionTickets))).appendTo('#ticketNew');


                    $("#bugNotAssignedUATList").empty();
                    $('#UATbugBugTmp').tmpl(setColorBasedOnCondition(todaysBugWithGroupByName(rehabBugListViewModel.UAT))).appendTo('#bugNotAssignedUATList');

                    $("#SupportNew").empty();
                    $('#ProductionSupportTmp').tmpl(setColorBasedOnCondition(todaysBugWithGroupByName(rehabBugListViewModel.ProductionSupport))).appendTo('#SupportNew');

                    $("#bugNotAssignedList").empty();
                    $('#notAssigneBugsTemp').tmpl(setColorBasedOnCondition(groupByName(rehabBugListViewModel.BugNotAssigned))).appendTo('#bugNotAssignedList');

                    $("#assignedTickets").empty();
                    console.log(rehabBugListViewModel.AssignedProductionTickets);
                    $('#AssignedProductionTicketsTmp').tmpl(setColorBasedOnCondition(groupByName(rehabBugListViewModel.AssignedProductionTickets))).appendTo('#assignedTickets');


                    //connectBugzilla();

                }


                //console.log(arguments);

            },
            error: function () {

            }
        });

    }
    var connectBugzilla = function () {

        var params = [{
            /* The authentication parameters */
            "Bugzilla_login": $("#userName").val(),
            "Bugzilla_password": $("#pwd").val(),
            /* The actual method parameters */
            "target_milestone": target_Sprint,
            "product": product,
            "status": ["NEW", "ASSIGNED", "VERIFIED", "REOPNED", "RESOLVED"]
                //"remember": "True"
            }];

        var myObject = {
            "method": "Bug.search",
            "params": JSON.stringify(params)
        };

        $.ajax({
            "contentType": "application/json",
            "data": myObject,
            /* jQuery will handle URI encoding */
            "crossDomain": "true",
            "dataType": "jsonp",
            /* jQuery will handle adding the 'callback' parameter */
            "url": "https://bugzilla.emids.com/jsonrpc.cgi",
            "type": "GET",
            success: function (data) {
                 $("#error").hide();
                if (data.result != null) {
                    buildViewModel(data.result.bugs);
                    getproductionTicket();

                }else
                    {
                        $("#error").show();
                       
                        $("#error").text("Incorrect UserName and Password .");
                    }


                //console.log(arguments);

            },
            error: function (err) {
             $("#error").show();
             $("#error").text(err)
            }
        });

    };


    return {
        init: init,
        connectBugzilla: connectBugzilla,
        rehabBugListViewModel: rehabBugListViewModel,
        onclickSet: onclickSet,
        getproductionTicket: getproductionTicket,
        connectMeNow:connectMeNow
    };

})();