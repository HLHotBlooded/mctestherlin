define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};//声明没有属性的对象
    var payload = {};
	var fieldArr = [];
	

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }

    function initialize(data) {
        console.log('====>'+data);
        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                
              
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log('====>1'+tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log('====>2'+endpoints);
    }
	
	var eventDefinitionKey;
	connection.trigger('requestTriggerEventDefinition');
	connection.on('requestedTriggerEventDefinition',
	function(eventDefinitionModel) {
		if(eventDefinitionModel){

			eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
			console.log(">>>Event Definition Key " + eventDefinitionKey);
			/*If you want to see all*/
			console.log('>>>Request Trigger',+JSON.stringify(eventDefinitionModel));
		}

	});
	
	var entrySchema;
	connection.trigger('requestSchema');
	connection.on('requestedSchema', function (data) {
	   // save schema
       console.log('*** Schema data***', JSON.stringify(data));
	   console.log('*** Schema ***', JSON.stringify(data['schema']));
	   entrySchema = data['schema'];

	for(var i = 0; i < entrySchema.length; i++) {
            var fld = entrySchema[i];
            console.log('Debug fld ', fld);
            // var fieldval = JSON.stringify(fld.key).replaceAll('"','');
            // console.log('Debug fieldval ', fieldval);
            // var fieldname = fieldval.split('.')[2];
            var fieldname = JSON.stringify(fld.name).replaceAll('"','');
            console.log('Debug fieldname ', fieldname);
            var fieldType = JSON.stringify(fld.type).replaceAll('"','');
            console.log('Debug fieldType ', fieldType);
            fieldArr.push(fieldname);
            console.log("Fieldsallarr1==",fieldArr);
        }
        // console.log("Fieldsallarr=="+fieldArr);
        // $("input[name='optArr']").val(fieldArr);
        // console.log("Fields=="+JSON.stringify($("input[name='optArr']").val()));

         //select cloum
        var select = document.getElementById("selectNumber");
        var options = fieldArr;
        console.log("select==>",select);
        for(var i = 0; i < options.length; i++) {
            var opt = options[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

   

	});
    
    //and generation
    // function generate(){
    //     console.log("result4444==");
    //     var result = '';
    
    //     result += document.getElementById('selectNumber').value;
    
    //     document.getElementById('output').innerHTML = result;
    //     console.log("result==",result);
    // }
   
    //replace setting
    String.prototype.replaceAll = function (FindText, RepText) {
    var regExp = new RegExp(FindText, "g");
    return this.replace(regExp, RepText);
	}
 
    function save() {
        var postcardURLValue = $('#postcard-url').val();
        var postcardTextValue = $('#postcard-text').val();
/*
        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "emailAddress": "{{Contact.Attribute.PostcardJourney.EmailAddress}}"
        }];
        */
		payload['arguments'].execute.inArguments.push({"Source": "saved" });

		// payload['arguments'].execute.inArguments.push({"CustomerName": "{{Event." + eventDefinitionKey+".CustomerName}}" });
        // console.log('payloaddatabinding '+payload['arguments'].execute.inArguments.push({"CustomerName": "{{Event." + eventDefinitionKey+".CustomerName}}" }));
		// for(var i = 0; i < entrySchema.length; i++) {
		// 	var fld = entrySchema[i];
		// 	console.log('cx debug fld', JSON.stringify(fld));
		// 	var fieldval = JSON.stringify(fld.key).replaceAll('"','');
		// 	var fieldname = fieldval.split('.')[2];
		// 	console.log('cx debug fieldname ', fieldname);
		// 	console.log('cx debug fieldval ', fieldval);
		// 	payload['arguments'].execute.inArguments.push({fieldname: fieldval });
 		// }
		 
		
        payload['metaData'].isConfigured = true;

        console.log('payload'+payload);
        connection.trigger('updateActivity', payload);
    }


});