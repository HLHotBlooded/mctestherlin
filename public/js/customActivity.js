define(function (require) {
    var Postmonger = require('postmonger');
    var connection = new Postmonger.Session();
    var payload = {};
    var steps = [
        {'key': 'eventdefinitionkey', 'label': 'Event Definition Key'}
    ];
    
    //HERE it works 
    //connection.trigger('requestSchema');
    
    var currentStep = steps[0].key;
    var deName;
    $(window).ready(function () {
        connection.trigger('ready');
    });
    
    function initialize(data) {
        if (data) {
            payload = data;
        }
    }
    
    function onClickedNext() { //SAVE USED HERE
        if (currentStep.key === 'eventdefinitionkey') {
            save();                       
        } else {
            connection.trigger('nextStep');
        }
    }
    
    function onClickedBack () {
        connection.trigger('prevStep');
    }
    
    function onGotoStep (step) {
        showStep(step);
        connection.trigger('ready');
    }
    
    function showStep (step, stepIndex) {
        if (stepIndex && !step) {
            step = steps[stepIndex - 1];
        }
    
        currentStep = step;
    
        $('.step').hide();
    
        switch  (currentStep.key) {
        case 'eventdefinitionkey':
            $('#step1').show();
            $('#step1 input').focus();
            break;
        }
    }
    
    
    
    function save() { //SAVE FUNCTION
        console.log('save');
        connection.trigger('requestSchema'); //NOT SHOWN IN CONSOLE
    
        let campaignNameKey = $('#select-campaign-name').val();
        let csvName = $('#select-csv-name').val();
    
        console.log("DE NAME " + deName);
        payload['arguments'] = payload['arguments'] || {};
        payload['arguments'].execute = payload['arguments'].execute || {};
    
        payload['arguments'].execute.inArguments = [{
            'campaignNameKey': campaignNameKey,
            'csvName': csvName,
            "Prenom": "{{Contact.Attribute."+ deName +".[\"Prénom\"]}}",
            "Nom": "{{Contact.Attribute." + deName +".Nom}}",
            "Mobile": "{{Contact.Attribute." + deName +".Mobile}}",
            "Campagne": "{{Contact.Attribute." + deName +".Campagne}}",
            "stopSMS": "{{Contact.Attribute." + deName +".stopSMS}}"
        }];
    
        payload['metaData'] = payload['metaData'] || {};
        payload['metaData'].isConfigured = true;
        //console.log(JSON.stringify(payload));
        connection.trigger('updateActivity', payload);
    }
    
    connection.on('requestedSchema', function (data) {    //CONNECTION ON
        // save schema
        console.log('*** Schema ***', JSON.stringify(data['schema']));
        let schema = JSON.stringify(data['schema']);
    });
    connection.on('initActivity', initialize);
    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);
    });