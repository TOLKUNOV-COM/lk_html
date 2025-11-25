import * as echarts from 'echarts';
import { declension } from "../utils.js";

export default function lineCharts() {
    document.querySelectorAll('[data-line-chart]').forEach((el) => {
        let categories, chartData, type;

        try {
            categories = JSON.parse(el.dataset.categories || '[]');
            chartData = JSON.parse(el.dataset.chartData || '[]');
            type = el.dataset.lineChart;
        } catch (e) {
            console.error(e);
        }

        if (categories && chartData && type) {
            createSingleLineChart(el, categories, chartData, type);
        }
    });
}

function createSingleLineChart(chartDom, categories, chartData, type) {
    if (!chartDom) {
        return null;
    }

    const myChart = echarts.init(chartDom);

    const data = chartData;
    const values = data.map(d => d?.value ?? null);

    const config = {
        projects: {
            name: 'Проекты',
            lineColor: '#2856F6',
            areaGradient: [
                { offset: 0.0801, color: 'rgba(175, 193, 255, 0.80)' },
                { offset: 1, color: 'rgba(202, 213, 255, 0.00)' }
            ],
            declensionWords: ['проект', 'проекта', 'проектов'],
            tooltipBackground: 'radial-gradient(129.82% 88.59% at 8.22% 31.77%, rgba(0, 255, 255, 0.30) 0%, rgba(0, 255, 255, 0.00) 100%), linear-gradient(132deg, rgba(0, 41, 255, 0.00) 26.1%, rgba(0, 41, 255, 0.40) 97.88%), #2856F6',
            tooltipBackgroundBlendMode: 'screen, overlay, normal'
        },
        resizes: {
            name: 'Ресайзы',
            lineColor: '#AB67FE',
            areaGradient: [
                { offset: 0.1089, color: 'rgba(224, 199, 254, 0.80)' },
                { offset: 1.0, color: 'rgba(224, 199, 254, 0.00)' }
            ],
            declensionWords: ['ресайз', 'ресайза', 'ресайзов'],
            tooltipBackground: 'radial-gradient(112.38% 73.15% at 7.09% 19.27%, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(132deg, rgba(64, 0, 255, 0.00) 26.1%, rgba(64, 0, 255, 0.40) 97.88%), #AB67FE',
            tooltipBackgroundBlendMode: 'screen, overlay, normal'
        },
        platforms: {
            name: 'Площадки',
            lineColor: '#FD6832',
            areaGradient: [
                { offset: 0.1352, color: 'rgba(255, 179, 151, 0.80)' },
                { offset: 1, color: 'rgba(255, 179, 151, 0.00)' }
            ],
            declensionWords: ['площадка', 'площадки', 'площадок'],
            tooltipBackground: 'radial-gradient(109.44% 78.95% at 6.9% 28.65%, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(132deg, rgba(255, 140, 0, 0.00) 26.1%, rgba(255, 140, 0, 0.40) 97.88%), #FD6832',
            tooltipBackgroundBlendMode: 'screen, overlay, normal'
        }
    };

    const chartConfig = config[type];
    if (!chartConfig) {
        return null;
    }

    const option = {
        grid: {
            left: 5,
            right: -30,
            top: 15,
            bottom: 9,
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: categories,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    margin: 16,
                    color: '#ABB1C4',
                    fontFamily: 'Craftwork Sans',
                    fontSize: 12,
                    fontWeight: 900,
                    lineHeight: 16,
                    letterSpacing: 0.3,
                    textTransform: 'uppercase',
                },
                splitLine: {
                    show: true,
                    lineStyle: { color: '#EFEDF0' }
                }
            },
            {
                type: 'category',
                boundaryGap: false,
                position: 'top',
                data: categories,
                axisLine: { show: false },
                axisLabel: { show: false },
                axisTick: {
                    show: true,
                    length: 8,
                    lineStyle: {
                        color: '#EFEDF0'
                    }
                },
                splitLine: { show: false }
            }
        ],
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                margin: 12,
                color: '#ABB1C4',
                fontFamily: 'Craftwork Sans',
                fontSize: 12,
                fontWeight: 900,
                lineHeight: 16,
                letterSpacing: 0.3,
                textTransform: 'uppercase',
            },
            splitLine: {
                show: true,
                lineStyle: { color: '#EFEDF0' }
            }
        },
        tooltip: {
            trigger: 'axis',
            appendToBody: true,
            confine: true,
            axisPointer: {
                type: 'line',
                snap: true,
                lineStyle: {
                    type: 'solid',
                    color: chartConfig.lineColor,
                    width: 3
                },
            },
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderRadius: 12,
            padding: 0,
            extraCssText: 'box-shadow: 0px 2px 8px 0px rgba(33, 37, 75, 0.11);',
            formatter: function (params) {
                const lastIdx = values.length - 1;
                const filtered = params.filter(p => !/ area$/.test(p.seriesName));
                if (!filtered.length) return '';
                const idx = filtered[0].dataIndex;

                if (idx === lastIdx) return '';

                const currentData = data[idx];
                if (!currentData || currentData.value === null) return '';

                const value = currentData.value;
                const text = declension(value, chartConfig.declensionWords);

                let percentChange = '';
                let percentSign = '';

                if (currentData.diff !== null && currentData.diff?.value !== null && currentData.diff?.sign !== null && currentData.diff?.prevMonth) {
                    percentSign = currentData.diff.sign;
                    percentChange = `${currentData.diff.value}% к ${currentData.diff.prevMonth}`;
                }

                const currentDetails = currentData.details || [];
                let detailsHtml = '';
                if (currentDetails.length > 0) {
                    detailsHtml = currentDetails.map(item => `
                        <div class="flex justify-between items-center gap-1">
                            <div class="font-sans text-slate-500 text-xs font-semibold leading-4">${item.label}</div>
                            <div class="font-sans text-blue-900 text-xs font-semibold leading-4">${item.value}</div>
                        </div>
                    `).join('');
                }

                return `
           <div class="rounded-xl overflow-hidden">
             <div style="background:${chartConfig.tooltipBackground};background-blend-mode:${chartConfig.tooltipBackgroundBlendMode};" class="flex flex-col items-start gap-2 p-3">
               <div class="flex items-baseline gap-1">
                 <div class="font-serif text-white text-[32px] font-bold leading-10">${value}</div>
                 <div class="font-sans text-white/60 text-sm font-semibold leading-4">${text}</div>
               </div>
               ${percentChange ? `<div class="rounded-lg bg-white/10 px-2 py-1 text-white"><div class="font-sans text-xs font-semibold leading-4 flex gap-1 items-center"><span class="text-lg/4 relative -top-px">${percentSign}</span><span class="text-white">${percentChange}</span></div></div>` : ''}
             </div>
             ${detailsHtml ? `<div class="bg-white p-3 flex flex-col gap-2">${detailsHtml}</div>` : ''}
           </div>
         `;
            },
        },
        series: [
            {
                name: `area ${chartConfig.name}`,
                type: 'line',
                smooth: true,
                connectNulls: true,
                symbol: 'none',
                lineStyle: { opacity: 0 },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, chartConfig.areaGradient)
                },
                data: values,
                zlevel: 0
            },
            {
                name: chartConfig.name,
                type: 'line',
                smooth: true,
                connectNulls: true,
                showSymbol: false,
                symbol: function (value, params) {
                    return params.dataIndex === values.length - 1 ? 'none' : 'circle';
                },
                symbolSize: 15,
                itemStyle: {
                    color: chartConfig.lineColor,
                    borderColor: '#ffffff',
                    borderWidth: 5,
                    shadowBlur: 6,
                    shadowColor: 'rgba(19, 15, 43, 0.10)',
                    shadowOffsetX: 0,
                    shadowOffsetY: 1
                },
                emphasis: {
                    showSymbol: true,
                },
                lineStyle: {
                    width: 4,
                    color: chartConfig.lineColor
                },
                data: values,
                zlevel: 1
            },
        ]
    };

    myChart.setOption(option);

    document.fonts.ready.then(() => {
        myChart.setOption(option);
        myChart.resize();
    });

    window.addEventListener('resize', () => {
        setTimeout(() => myChart.resize(), 1);
    });

    document.addEventListener('sidebar:collapse:end', () => myChart.resize());

    return myChart;
}
