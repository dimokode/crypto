;(function(){

function chart(){}

/*
const data = [
{ time: Date.parse('2012-01-26T13:51:50') / 1000, open: 29.630237296336794 , high: 35.36950035097501 , low: 26.21522501353531 , close: 30.734997177569916 },
{ time: Date.parse('2012-01-26T13:52:50') / 1000, open: 32.267626500691215 , high: 34.452661663723774 , low: 26.096868360824704 , close: 29.573918833457004 },
{ time: Date.parse('2012-01-26T13:53:50') / 1000, open: 32.267626500691215 , high: 34.452661663723774 , low: 26.096868360824704 , close: 29.573918833457004 },
{ time: Date.parse('2012-01-26T13:54:50') / 1000 , open: 27.33996760497746 , high: 35.8060364835531 , low: 27.33996760497746 , close: 33.06283432964511 },
{ time: Date.parse('2012-01-26T13:55:50') / 1000 , open: 31.1654368745013 , high: 31.97284477478497 , low: 26.766743287285593 , close: 27.364979322283386 },
{ time: Date.parse('2012-01-26T13:56:50') / 1000 , open: 29.5901452337888 , high: 32.147919593347474 , low: 27.53289219709677 , close: 29.202912415085272 },
{ time: Date.parse('2012-01-26T13:57:50') / 1000 , open: 27.561741523265923 , high: 35.11649043301526 , low: 25.20035866163233 , close: 31.14520649627546 },
{ time: Date.parse('2012-01-26T13:58:50') / 1000 , open: 31.925975006823798 , high: 31.925975006823798 , low: 28.998500720406675 , close: 29.87723790403876 },
{ time: Date.parse('2012-01-26T13:59:50') / 1000 , open: 30.826956088992475 , high: 34.79463130873015 , low: 25.291546123273097 , close: 28.994812708315987 },
{ time: Date.parse('2012-01-26T14:01:50') / 1000 , open: 31.202920145287838 , high: 33.19178819590413 , low: 23.94419012923956 , close: 31.47253745770869 },
{ time: Date.parse('2012-01-26T14:02:50') / 1000 , open: 26.927794164758666 , high: 34.6744456778885 , low: 26.927794164758666 , close: 31.091122539737423 },
{ time: Date.parse('2012-01-26T14:03:50') / 1000 , open: 26.452041173938298 , high: 34.527917622572154 , low: 26.452041173938298 , close: 27.65703395829094 },
];
*/

async function show(){
    const html = await template.loadRawTemplateByName('chart.html');
    $('content').html(html);
    const chart = new LWC('#chart');
    // const chart2 = new LWC('#chart2');
    const series = chart.addCandlestickSeries();
    series.series.priceScale().applyOptions({
        scaleMargins: {
            top: 0, // highest point of the series will be 70% away from the top
            bottom: 0.2,
        },
      });
    
    // const series2 = chart2.addAreaSeries();
    // series2.series.priceScale().applyOptions({
    //     scaleMargins: {
    //         top: 0.8, // highest point of the series will be 70% away from the top
    //         bottom: 0,
    //     },
    //   });


    const seriesVolume = chart.addHistogramSeries({
		priceFormat: {
			type: 'volume',
		},
		priceLineVisible: true,
		color: 'rgba(76, 175, 80, 0.5)',
		priceScaleId: '',
        LineWidth: 2,
		// scaleMargins: {
		// 	top: 0.9,
		// 	bottom: 0,
		// },
    });
    seriesVolume.series.priceScale().applyOptions({
        scaleMargins: {
            top: 0.8, // highest point of the series will be 70% away from the top
            bottom: 0,
        },
      });


    const data = await bina.convertKlines('BTCUSDT', '1m');
    console.log(data);
    
    series.setData(data['klines']);
    // series2.setData(data['lines']);
    seriesVolume.setData(data['volumes']);
    chart.chart.timeScale().fitContent();
    // chart2.timeScale().fitContent();
 

    //chart.fitContent();


    // function clickHadlerTakeProfit(param) {
    //     const price = series.coordinateToPrice(param.point.y);
    //     //console.log(price);
    //     let priceLine = series.createPriceLine({
    //         price : price,
    //         color : 'green',
    //         title : `Take (${price})`
    //     });
    //     console.log(priceLine);
    //     chart.updateBtnElement('btnTakeProfit', 'line', priceLine);
    //     chart.unsubscribeClick( clickHadlerTakeProfit );
    // }

    
    // function clickHadlerStopLoss(param) {
    //     const price = series.coordinateToPrice(param.point.y);
    //     //console.log(price);
    //     let priceLine = series.createPriceLine({
    //         price : price,
    //         color : 'red',
    //         title : `Stop (${price})`
    //     });
    //     console.log(priceLine);
    //     chart.updateBtnElement('btnStopLoss', 'line', priceLine);
    //     chart.unsubscribeClick( clickHadlerStopLoss );
    // }


    //let indexOfMinPrice = LWC.findMin(data);
    /*
    let markers = [];
    markers.push({ time: data[3].time, position: 'aboveBar', color: '#f68410', shape: 'circle', text: 'D' });
    markers.push({ time: data[indexOfMinPrice].time, position: 'belowBar', color: '#2196F3', shape: 'arrowUp', text: 'Buy @ ' + Math.floor(data[indexOfMinPrice].low) });
    markers.push({ time: data[6].time, position: 'aboveBar', color: '#e91e63', shape: 'arrowDown', text: 'Sell @ ' + Math.floor(data[6].high) });
    series.setMarkers(markers);
    */

    // chart.bindBtnElement( document.querySelector('#btnTakeProfit'), 'btnTakeProfit', ()=>{
    //     //alert('Hello!');
    //     let line = chart.getBtnElementProp('btnTakeProfit', 'line');
    //     if(line != null){
    //         const response = series.removePriceLine(line);
    //         console.log(response);
    //     }
    //     chart.subscribeClick( clickHadlerTakeProfit );
    // });
    

    // chart.bindBtnElement( document.querySelector('#btnStopLoss'), 'btnStopLoss', ()=>{
    //     //alert('Hello!');
    //     let line = chart.getBtnElementProp('btnStopLoss', 'line');
    //     if(line != null){
    //         const response = series.removePriceLine(line);
    //         console.log(response);
    //     }
    //     chart.subscribeClick( clickHadlerStopLoss );
    // });
}

chart.show = show;
window.chart = chart;
})();