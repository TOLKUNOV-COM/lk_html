import * as echarts from 'echarts';

// Функция для склонения слов в русском языке
function declension(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

// 1) дождёмся, пока DOM загрузится
export default function lineChart() {
    // 2) найдём контейнер
    const chartDom = document.getElementById('lineChart');
    // 3) инициализируем инстанс
    const myChart = echarts.init(chartDom);

    const dataA = [21, 32, 50, 40, 60, 80, 50, 80];
    const dataB = [10, 20, 40, 30, 50, 70, 60, 80];

    const categories = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', /*'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК',*/ ''];

    // 4) опции графика (простой пример)
    const option = {
        grid: {
            left: 0,
            right: -30,
            top: 15,
            bottom: 9,
            containLabel: true
        },
        xAxis: {
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
                textStyle: { textTransform: 'uppercase' }
            },
            splitLine: {
                show: true,
                lineStyle: { color: '#EFEDF0' }
            }
        },
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
                textStyle: { textTransform: 'uppercase' }
            },
            splitLine: {
                show: true,
                lineStyle: { color: '#EFEDF0' }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                snap: true,
                lineStyle: {
                    type: 'solid',
                    color: '#2856F6',
                    width: 1.5
                },
            },
            backgroundColor: '#ffffff',      // белый фон
            borderRadius: 16,
            padding: 16,
            extraCssText: 'box-shadow: 0px 2px 8px 0px rgba(33, 37, 75, 0.11);',
            formatter: function (params) {
                // Предполагаем, что длина всех серий одинаковая (как в твоем случае)
                const lastIdx = dataA.length - 1;
                // Фильтруем реальные серии без областей
                const filtered = params.filter(p => !/ area$/.test(p.seriesName));
                if (!filtered.length) return '';
                const idx = filtered[0].dataIndex;
                // Не показываем на последней точке
                if (idx === lastIdx) return '';
                // Маппинг месяца
                const monthMap = {
                    'ЯНВ': 'Январь', 'ФЕВ': 'Февраль', 'МАР': 'Март', 'АПР': 'Апрель',
                    'МАЙ': 'Май', 'ИЮН': 'Июнь', 'ИЮЛ': 'Июль'
                };
                const short = filtered[0].axisValue;
                const fullMonth = monthMap[short] || short;
                // Значения серий
                const valA = filtered.find(p => p.seriesName === 'Серия A')?.value || 0;
                const valB = filtered.find(p => p.seriesName === 'Серия B')?.value || 0;
                // Склоняем
                const textA = declension(valA, ['проект', 'проекта', 'проектов']);
                const textB = declension(valB, ['ресайз', 'ресайза', 'ресайзов']);
                // Генерируем HTML тултипа
                return `
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="color:#161F6A;font-family:'Craftwork Grotesk';font-size:18px;font-weight:700;line-height:24px;letter-spacing:0.18px;">${fullMonth}</div>
            <div style="width:100%;height:1px;background:#EFEDF0;"></div>
            <div style="display:flex;flex-wrap:nowrap;gap:12px;">
              <div style="display:flex;align-items:center;gap:4px;">
                <div style="color:#161F6A;font-family:'Craftwork Grotesk';font-size:18px;font-weight:700;line-height:24px;letter-spacing:0.18px;">${valA}</div>
                <div style="color:#6E7185;font-family:'Craftwork Sans';font-size:16px;font-weight:500;line-height:20px;letter-spacing:0.32px;">${textA}</div>
              </div>
              <div style="display:flex;align-items:center;gap:4px;">
                <div style="color:#161F6A;font-family:'Craftwork Grotesk';font-size:18px;font-weight:700;line-height:24px;letter-spacing:0.18px;">${valB}</div>
                <div style="color:#6E7185;font-family:'Craftwork Sans';font-size:16px;font-weight:500;line-height:20px;letter-spacing:0.32px;">${textB}</div>
              </div>
            </div>
          </div>
        `;
            },
        },
        series: [
            {
                name: 'area Серия B',
                type: 'line',
                smooth: true,
                connectNulls: true,
                symbol: 'none',
                lineStyle: { opacity: 0 },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0.1089, color: 'rgba(224, 199, 254, 0.80)' },
                        { offset: 1.0, color: 'rgba(224, 199, 254, 0.00)' }
                    ])
                },
                data: dataB,
                zlevel: 0
            },
            {
                name: 'area Серия A',
                type: 'line',
                smooth: true,
                connectNulls: true,
                symbol: 'none',
                lineStyle: { opacity: 0 },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0.0801, color: 'rgba(175, 193, 255, 0.80)' },
                        { offset: 1, color: 'rgba(202, 213, 255, 0.00)' }
                    ])
                },
                data: dataA,
                zlevel: 0
            },

            {
                name: 'Серия B',
                type: 'line',
                smooth: true,
                connectNulls: true,
                showSymbol: false,
                symbol: function (value, params) {
                    return params.dataIndex === dataA.length - 1 ? 'none' : 'circle';
                },
                symbolSize: 15,
                itemStyle: {
                    color: '#AB67FE',
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
                    color: '#AB67FE'
                },
                data: dataB,
                zlevel: 1
            },
            {
                name: 'Серия A',
                type: 'line',
                smooth: true,
                connectNulls: true,
                showSymbol: false,
                symbol: function (value, params) {
                    return params.dataIndex === dataA.length - 1 ? 'none' : 'circle';
                },
                symbolSize: 15,
                itemStyle: {
                    color: '#2856F6',
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
                    color: '#2856F6'
                },
                data: dataA,
                zlevel: 1
            },

        ]
    };

    // 5) отрисуем
    myChart.setOption(option);

    // Скрывать axisPointer и тултип на последней точке
    myChart.on('showTip', params => {
        if (params.dataIndex === lastIdx) {
            myChart.dispatchAction({ type: 'hideTip' });
        }
    });

    // 6) реакция на ресайз окна
    window.addEventListener('resize', () => {
        myChart.resize();
    });
}
