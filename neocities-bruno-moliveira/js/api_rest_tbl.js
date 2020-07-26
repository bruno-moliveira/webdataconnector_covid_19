(function() {
    // Criar objeto de conexão ao tableau
    var tableauConnector = tableau.makeConnector();

    // definir campos e nome da tabela do arquivo origem
    tableauConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "Province_State",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Country_Region",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Last_Update",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "Lat",
            alias: "latitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "Long_",
            alias: "longitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "Confirmed",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "Deaths",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "Recovered",
            dataType: tableau.dataTypeEnum.int
        }];

        var tableSchema = {
            id: "Cases",
            alias: "Cases COVID-19",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // incluir com extensão json e requisição get na API 
    tableauConnector.getData = function(table, doneCallback) {
        $.getJSON("https://opendata.arcgis.com/datasets/bbb2e4f589ba40d692fab712ae37b9ac_1.geojson", function(resp) {
            var feat = resp.features,
                tableData = [];

            // Atribuir as opçoes de saída do arquivo JSON 
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "Province_State": feat[i].properties.Province_State,
                    "Country_Region": feat[i].properties.Country_Region,
                    "Last_Update": feat[i].properties.Last_Update,
                    "Lat": feat[i].properties.Lat,
                    "Long_": feat[i].properties.Long_,
                    "Confirmed": feat[i].properties.Confirmed,
                    "Deaths": feat[i].properties.Deaths,
                    "Recovered": feat[i].properties.Recovered
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(tableauConnector);

    // Criar botão de requisição
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "CASES DATABASE COVID-19"; // Nome para fonte de dados no tableau
            tableau.submit(); // enviar objeto de conexão ao tableau
        });
    });
})();
