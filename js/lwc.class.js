class LWC {


    constructor( containerSelector ){
        console.log('createChart');

        //this.buttons = {}

        const container = document.querySelector( containerSelector );
        this.chart = LightweightCharts.createChart( container, {
            width : 1000,
            height: 400,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: '#D1D4DC',
            },
            rightPriceScale: {
                scaleMargins: {
                    top: 0.3,
                    bottom: 0.25,
                },
                borderColor: '#D1D4DC',
                borderVisible: false,
            },
            layout: {
                backgroundColor: '#ffffff',
                textColor: '#000',
            },
            grid: {
                horzLines: {
                color: '#F0F3FA',
            },
            vertLines: {
                color: '#F0F3FA',
            },
            },
        });
        return {
            chart : this.chart,
            buttons : {},
            addCandlestickSeries(){
                console.log('addCandlestickSeries');
                this.series = this.chart.addCandlestickSeries({
                    upColor: 'rgb(38,166,154)',
                    downColor: 'rgb(255,82,82)',
                    wickUpColor: 'rgb(38,166,154)',
                    wickDownColor: 'rgb(255,82,82)',
                    borderVisible: false,
                });
                return {
                    series : this.series,
                    setData( data ){
                        //console.log('setData');
                        this.series.setData(data);
                        return this.series;
                    },

                    update( data ){
                        this.series.update(data);
                    },

                    createPriceLine(obj){
                        return this.series.createPriceLine({
                            price: obj.price,
                            color: (obj.color !== undefined) ? obj.color : 'black',
                            lineWidth: 2,
                            lineStyle: LightweightCharts.LineStyle.Dotted,
                            axisLabelVisible: true,
                            title: (obj.title !== undefined) ? obj.title : '',
                        });
                    },
                    removePriceLine(priceLine){
                        return this.series.removePriceLine(priceLine);
                    },

                    setMarkers(markers){
                        this.series.setMarkers(markers);
                    },
                    coordinateToPrice( y ){
                        return this.series.coordinateToPrice(y);
                    }
                    

                }
            },


            addHistogramSeries(obj){
                console.log('addHistogramSeries');
                this.series = this.chart.addHistogramSeries(obj);
                return {
                    series : this.series,
                    setData( data ){
                        console.log('setData');
                        //console.log('setData');
                        this.series.setData(data);
                        return this.series;
                    },
                    update( data ){
                        this.series.update(data);
                    },
                }
            },

            addLineSeries(){
                this.series = this.chart.addLineSeries();
                return {
                    series : this.series,
                    setData( data ){
                        console.log('setData');
                        //console.log('setData');
                        this.series.setData(data);
                        return this.series;
                    },
                }
            },


            addAreaSeries(){
                this.series = this.chart.addAreaSeries();
                return {
                    series : this.series,
                    setData( data ){
                        console.log('setData');
                        //console.log('setData');
                        this.series.setData(data);
                        return this.series;
                    },
                }
            },


            fitContent(){
                this.chart.timeScale().fitContent();    
            },
            subscribeCrosshairMove( param ){
                this.chart.subscribeCrosshairMove( param );
            },

            subscribeClick( param ){
                this.chart.subscribeClick( param );
            },
            unsubscribeClick( myClickHandler ){
                this.chart.unsubscribeClick( myClickHandler );
            },


            bindBtnElement( btnElement, name, func ){
                btnElement.onclick = func;
                this.buttons[name] = {
                    element : btnElement,
                    line : null
                }
            },
            updateBtnElement( name, prop, value ){
                this.buttons[name][prop] = value;
            },
            getBtnElementProp(name, prop){
                return this.buttons[name][prop];
            },
            showButtons() {
                console.log(this.buttons);
            }
        }
    }

    static findMin(data) {
        let indexOfMinPrice = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].high < data[indexOfMinPrice].high) {
                indexOfMinPrice = i;
            }
        }
        return indexOfMinPrice;
    }


    showButtons() {
        console.log(this.buttons);
    }


}