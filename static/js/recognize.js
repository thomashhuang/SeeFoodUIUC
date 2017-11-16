function recognize(link) {

    const fullClient = retinaSDK.FullClient("5dfc0c20-a095-11e7-9586-f796ac0731fb", "http://api.cortical.io/rest/", "en_associative");
    const app = new Clarifai.App({apiKey: 'ef5deeb1449d41629720e2177bdacb84'});
    const linkToImage = link;

    // Change this to the list of dining options on the day and location the input image was taken at.
    const inputs = ["Bacon", "French Toast", "Hard Cooked Eggs", "Scrambled Eggs", "Vegetarian Sausage Patty", "Chai Oatmeal", "White Rice", "Tater-Tots", "Pancake Syrup", "Fruit Tray"];

    app.models.predict(Clarifai.FOOD_MODEL, linkToImage).then(
        function(response) {
            var words = "";
            var wordArray = [];

            $.each(response.outputs[0].data.concepts, function(i, val) {
                words = words + val.name + " ";
                wordArray.push([val.name, val.value]);
            });
            var inpuDict = {};
            var encodedAuth = 'Basic ' + window.btoa("a68f17c2c5ab8c904f65" + ':' + "afa63e36d111a1a8398158b3f7059b8e614a4df4");

            // Give every element a default of 0.
            $.each(inputs, function(i, val) {
                inpuDict[val] = 0;
            });

            // Compare menu items to the description of the image.
            $.each(inputs, function(i2, val2) {
                comp = fullClient.compare({comparison: [{"text": val2}, {"text": words}]});
                if (comp.cosineSimilarity > 0) {
                    inpuDict[val2] = inpuDict[val2] + (comp.cosineSimilarity * 1);
                }
                if (i2 == (inputs.length - 1)) {
                    return doneish();
                }
            });

            // Find the best match and update the page with the information.
            function doneish() {
                // Get a final array formatted for printing.
                var arry = [];
                $.each(inputs, function(i, val) {
                    arry.push(inpuDict[val]);
                });
                arry.sort();
                var finarr = [];
                $.each(arry, function(i,val) {
                    $.each(inputs, function(i2, val2) {
                        if (inpuDict[val2] === val) {
                            finarr.push(val2);
                        }
                    });
                });
                finarr.reverse();
                return finarr[0];
            }
        },
    );
}
