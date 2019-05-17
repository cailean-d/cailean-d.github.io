let container = document.getElementById('popup');
let content = document.getElementById('popup-content');
let closer = document.getElementById('popup-closer');


Vue.component('vue-map', {
    template: '<div ref="map" class="map"></div>',
    data: () => ({
        map: null
    }),
    mounted() {
        this.initialize();
    },
    methods: {
        initialize() {
            let overlay = new ol.Overlay({
                element: container,
                autoPan: true,
                autoPanAnimation: {
                  duration: 250
                }
              });

              closer.onclick = function() {
                overlay.setPosition(undefined);
                closer.blur();
                return false;
              };

            this.map = new ol.Map({
                target: this.$refs.map,
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([46.0676732, 41.3403794]),
                    zoom: 4
                }),
                overlays: [overlay],
            });

            this.map.on('singleclick', e => {
                let hitMarkers = false;

                this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
                    hitMarkers = true;

                    if (feature.get('id') == 'marker') {
                        let pixel = this.map.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
                        pixel[1] -= 35;
                        let point = this.map.getCoordinateFromPixel(pixel);
                        content.innerHTML = '<p>Some text</p>';
                        overlay.setPosition(point);
                    } else {
                        var features = layer.getSource().getFeatures();

                        for (var i in features) {
                            var feature = features[i];
                            if (feature.get('id') == 'marker') {
                                let
                                    style = feature.getStyle(),
                                    image = style.getImage(),
                                    rotation = image.getRotation();
                                
                                image.setRotation(rotation + 5);
                                feature.setStyle(style);
                            }
                        }
                        
                    }
                    

                   
                })

                if (!hitMarkers) {
                    let coords = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
                    this.drawMarker({lng: coords[0], lat: coords[1]})
                }

            });


            this.map.on("pointermove", function (evt) {
                var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
                    return true;
                }); 
                if (hit) {
                    this.getTarget().style.cursor = 'pointer';
                } else {
                    this.getTarget().style.cursor = '';
                }
            });

            this.loadMarkers();


        },
        drawMarker(marker) {
            let features = [];
            let longitude = marker.lng;
            let latitude = marker.lat;
            let coords = ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857');
        
            let markerFeature = new ol.Feature({
                geometry: new ol.geom.Point(coords)
            });

            markerFeature.set('id', 'marker');

            // console.log(coords)

            // let pixel = this.map.getPixelFromCoordinate(coords);
            // pixel[1] += 1;
            // let point = this.map.getCoordinateFromPixel(pixel);

            // coords[1] -= 10000;

            let textFeature = new ol.Feature({
                geometry: new ol.geom.Point(coords)
            });

            textFeature.set('id', 'text');

            // markerFeature.set('name', 'marker')
            // markerFeature.set('h', latitude)
            // markerFeature.set('v', longitude)

            let markerStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 1],
                    src: "http://cdn.mapmarker.io/api/v1/pin?text=P&size=35&hoffset=1",
                    rotation: 0 * (Math.PI/180) 
                }))
            });


            let textStyle = new ol.style.Style({
                text: new ol.style.Text({
                    font: 'bold 12px Calibri,sans-serif',
                    fill: new ol.style.Fill({ color: '#559060' }),
                    stroke: new ol.style.Stroke({
                      color: '#fff', width: 2
                    }),
                    // get the text from the feature - `this` is ol.Feature
                    // and show only under certain resolution
                    text: 'rotate',
                    offsetY: 5
                  })
            })
        
            markerFeature.setStyle(markerStyle);
            textFeature.setStyle(textStyle);
            features.push(markerFeature);
            features.push(textFeature);
            
            let vectorSource = new ol.source.Vector({ features: features });
            let vectorLayer = new ol.layer.Vector({ source: vectorSource });

            this.map.addLayer(vectorLayer);
        },
        loadMarkers() {
            fetch('markers.json')
            .then(res => {
                return res.json()
            })
            .then(data => {
                data.markers.forEach( i => {
                    this.drawMarker(i)
                })
            })
        }
 
    }
})



let app = new Vue({
    el: '#app',
    data: {},
    methods: {}
})


