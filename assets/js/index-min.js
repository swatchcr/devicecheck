angular.module("devicechecker.directives",[]).directive("activeTable",function(){return{restrict:"A",link:function(c,b,a){if(angular.isString(a.activeTable)){b.dataTable({aoColumns:[{mData:"user"},{mData:"status"},{mData:"date"}],aaSorting:[[2,"desc"]]});c.$watchCollection("actual.history",function(d){b.dataTable().fnClearTable();b.dataTable().fnAddData(d)});if(c.device&&c.actual&&c.actual.history){b.dataTable().fnAddData(c.actual.history)}}}}});angular.module("device",["ui.bootstrap","firebase","devicechecker.directives"]).value("fbURL","https://devicetrack.firebaseio.com/").value("deviceBasePath","stock/").factory("time",function(){var b={};(function a(){b.now=new Date()}());return b}).controller("ListCtrl",["$rootScope","angularFireCollection","fbURL","deviceBasePath",function(a,c,d,b){a.stocks=c(new Firebase(d+b))}]).controller("DeviceCtrl",["$rootScope","$location","time","$routeParams","fbURL","deviceBasePath",function(a,g,e,d,f,c){var b=d.groupId==="Smartphones"?a.stocks[0]:a.stocks[1];if(b){a.actual=b[d.deviceId]}a.$watchCollection("stocks",function(i){if(d.groupId&&!d.checkItOut){var h=d.groupId==="Smartphones"?a.stocks[0]:a.stocks[1];if(h){a.actual=h[d.deviceId]}}else{d.checkItOut=false}});a.time=e;a.$routeParams=d;a.send=function(j,i){var l=a.actual,k=j.groupId+"/"+j.deviceId,h=new Firebase(f+c+k),m={};h.once("value",function(t){var s=CryptoJS.MD5(l.password).toString(),r={user:l.user,status:"Checked-in",date:moment().format("YYYY-MM-DD hh:mm:ss a")},q,n=t.child("inUse").val(),o=t.child("lockPhrase").val(),p=t.child("user").val();if(!l.history){l.history=[]}else{l.history=t.child("history").val();q=l.history.length;if(q>=80){l.history=l.history.slice(q-79,q)}}if(n&&(p===l.user)){if(o!==s){i.$error.invalid=true;i.$valid=false;i.$invalid=true}else{i.$error.invalid=false;i.$valid=true;i.$invalid=false;l.user="";l.lockPhrase="";l.history.push(r);l.inUse=false;m={inUse:false,user:"",password:"",lockPhrase:"",history:l.history}}}else{if(!n&&(o==="")&&(p==="")){r.status="Checked-out";l.inUse=true;l.lockPhrase=s;l.history.push(r);j.checkItOut=true;m={inUse:true,user:l.user,password:"",lockPhrase:s,history:l.history}}}});h.update(m)};if(!a.actual){g.path("/")}}]).config(["$routeProvider",function(a){a.when("/:groupId/:deviceId",{controller:"DeviceCtrl",templateUrl:"/devicetracker/device.html",controllerAs:"device"}).otherwise({redirectTo:"/"})}]);