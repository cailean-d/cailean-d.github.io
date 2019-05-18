Vue.component('vue-map', {
    template: ` <div>
                    <div ref="map" class="map"></div>
                    <div ref="popup" class="ol-popup">
                        <a href="#" ref="popupCloser" class="ol-popup-closer"></a>
                        <div ref="popupContent"></div>
                    </div>
                </div>`,
    data: () => ({
        map: null,
        overlay: null,
        textColor: '#559060',
        textHoverColor: '#f00',
        startCoords: [46.0676732, 41.3403794],
        zoom: 5,
        minZoom: 5,
        maxZoom: 19,
        angleRotation: 45,
        markerText: 'rotate',
        markerSource: 'marker.png',
        markerScale: 0.5
    }),
    mounted() {
        this.initialize();
    },
    methods: {
        initialize() {
            this.initOverlay();
            this.initMap();
            this.loadMarkers();

            this.map.on('singleclick', e => {
                let hit = false;

                this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
                    hit = true;
                    if (feature.get('id') == 'marker') {
                        this.showOverlay(feature);
                    } else if (feature.get('id') == 'text') {
                        this.rotateMarker(layer);
                    }
                })

                if (!hit) {
                    this.setMarket(e.coordinate);
                }

            });

            this.map.on("pointermove", e => {
                this.resetTextColor();
                let hit = this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
                    if (feature.get('id') == 'text') {
                        this.setTextColor(feature, this.textHoverColor);
                    }
                    return true;
                }); 

                if (hit) {
                    this.map.getTarget().style.cursor = 'pointer';
                } else {
                    this.map.getTarget().style.cursor = '';
                }
            });

        },
        initOverlay() {
            this.overlay = new ol.Overlay({
                element: this.$refs.popup,
                autoPan: true,
                autoPanAnimation: {
                  duration: 250
                }
            });

            this.$refs.popupCloser.onclick = () => {
                this.overlay.setPosition(undefined);
                this.$refs.popupCloser.blur();
                return false;
            };
        },
        initMap() {
            this.map = new ol.Map({
                target: this.$refs.map,
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat(this.startCoords),
                    zoom: this.zoom,
                    minZoom: this.minZoom,
                    maxZoom: this.maxZoom
                }),
                overlays: [this.overlay],
            });
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

            let markerStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 0.5],
                    src: this.markerSource,
                    rotation: marker.angle * (Math.PI/180),
                    scale: this.markerScale
                }))
            });

            let textFeature = new ol.Feature({
                geometry: new ol.geom.Point(coords)
            });
            textFeature.set('id', 'text');

            let textStyle = new ol.style.Style({
                text: new ol.style.Text({
                    font: 'bold 12px Calibri,sans-serif',
                    fill: new ol.style.Fill({ color: this.textColor }),
                    stroke: new ol.style.Stroke({
                      color: '#fff', width: 2
                    }),
                    text: this.markerText,
                    offsetY: 20
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
        showOverlay(feature) {
            let point = this.addPixelsToCoords(feature.getGeometry().getCoordinates(), -10);
            this.$refs.popupContent.innerHTML = '<p>Some text</p>';
            this.overlay.setPosition(point);
        },
        setMarket(coordinate) {
            let coords = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
            let marker = {lng: coords[0], lat: coords[1], angle: 0};
            console.log('new marker: ', marker.lng, marker.lat, marker.angle);
            this.drawMarker(marker);
        },
        rotateMarker(layer) {
            let features = layer.getSource().getFeatures();
            features.forEach(i => {
                if (i.get('id') == 'marker') {
                    let style = i.getStyle();
                    let image = style.getImage();
                    let rotation = image.getRotation();
                    let newRotation = rotation +  this.angleRotation * (Math.PI/180);
                    let newAngle = Math.round((newRotation * (180/Math.PI)) % 360);
                    console.log('new rotation: ' + newAngle)
                    image.setRotation(newRotation);
                    i.setStyle(style);
                }
            });
        },
        setTextColor(feature, color) {
            let style = feature.getStyle();
            let text = style.getText();
            text.setFill(new ol.style.Fill({ color: color }));
            feature.setStyle(style);
        },
        resetTextColor() {
            let layers = this.map.getLayers().getArray();
            layers.forEach(i => {
                if (i.type == 'VECTOR') {
                    let features = i.getSource().getFeatures();
                    features.forEach(i => {
                        if (i.get('id') == 'text') {
                            this.setTextColor(i, this.textColor);
                        }
                    })
                }
            })
        },
        addPixelsToCoords(coords, pixels) {
            let pixel = this.map.getPixelFromCoordinate(coords);
            pixel[1] = pixel[1] + pixels;
            return this.map.getCoordinateFromPixel(pixel);
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
        },
    }
})


let app = new Vue({
    el: '#app',
    data: {},
    methods: {}
})


