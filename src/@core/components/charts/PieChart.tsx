import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const PieChart = () => {
  const options = {
    chart: {
      type: 'pie'
    },
    title: {
      text: '장소별 방문자수'
    },
    tooltip: {
      valueSuffix: '명'
    },
    subtitle: {
      text: ''
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: [
          {
            enabled: true,
            distance: 20
          },
          {
            enabled: true,
            distance: -40,
            format: '{point.percentage:.1f}%',
            style: {
              fontSize: '1.2em',
              textOutline: 'none',
              opacity: 0.7
            },
            filter: {
              operator: '>',
              property: 'percentage',
              value: 10
            }
          }
        ]
      }
    },
    series: [
      {
        name: '방문자수',
        colorByPoint: true,
        data: [
          { name: '교육동2층', y: 11460 },
          { name: '식물원입구', y: 19455, sliced: true, selected: true },
          { name: '농업관01', y: 13748 },
          { name: '농업관02', y: 8113 },
          { name: '어린이박물관', y: 4821 },
          { name: '기획전시실', y: 3195 },
          { name: '북문', y: 1641 }
        ]
      }
    ]
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default PieChart
