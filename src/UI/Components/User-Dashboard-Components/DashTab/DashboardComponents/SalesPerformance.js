'use client'
import React from 'react'
import './SalesPerformace.css';
import dynamic from 'next/dynamic';
// import ReactApexChart from 'react-apexcharts';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SalesPerformance = ({ data }) => {
    const totalReview = data?.summary?.totalReview || 0;
    const isZeroOrLow = totalReview <= 0;

    const fallbackColor = 'green'; // inner color when not filled
    const borderColor = 'orange';

    const [state, setState] = React.useState({

        series: [data?.summary?.totalReview ?? 0],
        options: {
            chart: {
                type: 'radialBar',
                height: 300,
                offsetY: -5,
                sparkline: {
                    enabled: true
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -140,
                    endAngle: 140,
                    track: {
                        background: 'rgba(198, 27, 26, 0.2)',
                        strokeWidth: '97%',
                        margin: 20, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#444',
                            opacity: 1,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            show: false
                        }
                    }
                }
            },
            grid: {
                padding: {
                    top: -10
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'linear',
                    gradientToColors: ['var(--tertiary-color)'], // Last color in the gradient
                    stops: [13.68, 49.84, 86.01], // Matching percentages of the gradient
                    colorStops: [
                        {
                            offset: 13.68,
                            color: 'var(--tertiary-color)',
                            opacity: 1,
                        },
                        {
                            offset: 49.84,
                            color: 'var(--tertiary-color)',
                            opacity: 1,
                        },
                        {
                            offset: 86.01,
                            color: 'var(--tertiary-color)',
                            opacity: 1,
                        },
                    ],
                },
            },
            stroke: {
                dashArray: 10,
                // color: ['var(--orange-fill)'] // Stroke color set to #C611B1A
            },
            labels: ['Average Results'],
        },
    });


    const [strockedCircleState, setStrockedCircleState] = React.useState({

        series: [data?.summary?.totalReview],
        options: {
            chart: {
                height: 250,
                type: 'radialBar',
                offsetY: 0
            },
            plotOptions: {
                radialBar: {
                    startAngle: -140,
                    endAngle: 140,
                    
                    track: {
                        // background: 'rgba(198, 27, 26, 0.2)',
                        fill: 'var(--tertiary-color)',
                        strokeWidth: '100%'
                    },
                    dataLabels: {
                        name: {
                            fontSize: '10px',
                            color: 'var(--secondary-color)',
                            offsetY: 20,
                            // show: false

                        },
                        value: {
                            // show: false,
                            offsetY: -20,
                            fontSize: '30px',
                            color: '#000',
                            formatter: function (val) {
                                return val + "%";
                            }
                        }
                    }
                }
            },
            fill: {
                type: 'gradient',
                // colors: ['#C611B1A'],
                gradient: {
                    shade: 'dark',
                    type: 'linear',
                    gradientToColors: ['var(--tertiary-color)'], // Last color in the gradient
                    stops: [13.68, 49.84, 86.01], // Matching percentages of the gradient
                    colorStops: [
                        {
                            offset: 13.68,
                            color: 'var(--tertiary-color)',
                            opacity: 1,
                        },
                        {
                            offset: 49.84,
                            color: 'var(--tertiary-color)',
                            opacity: 1,
                        },
                        {
                            offset: 86.01,
                            color: 'var(--tertiary-color)',
                            opacity: 1,
                        },
                    ],
                },
            },

            stroke: {
                dashArray: 10,
                // color: ['var(--orange-fill)'] // Stroke color set to #C611B1A
            },

            labels: ['Out of 100 points'],
        },

    });


    React.useEffect(() => {
        if (data?.summary?.totalReview !== undefined) {
            setState((prev) => ({
                ...prev,
                series: [data.summary.totalReview],
            }));
            setStrockedCircleState((prev) => ({
                ...prev,
                series: [data.summary.totalReview],
            }));
        }
    }, [data]);

    return (
        // <div className='sales-performance-main-container'>
        <div className='sales-performance-inner-container'>
            <div className='sales-performance-head-head'>
                <p>Reviews</p>
            </div>
            {data?.summary?.totalReview !== undefined && (
                <div className='sales-performance-body'>
                    <div id="chart" className='radial-chart-container'>
                        <ReactApexChart
                            key={strockedCircleState.series[0]}
                            options={state.options}
                            series={state.series}
                            type="radialBar"
                            height={300}
                        />

                    </div>
                    {/* <div className='inner-lined-chart'> */}
                    <div id="chart2" className='inner-lined-chart'>
                        <ReactApexChart
                            key={strockedCircleState.series[0]}
                            options={strockedCircleState.options}
                            series={strockedCircleState.series}
                            type="radialBar"
                            height={250}
                        />
                    </div>
                    {/* <div id="html-dist"></div> */}
                    {/* </div> */}
                    <div id="html-dist"></div>
                    <div className='sale-performance-under-line'></div>
                    <div className='sale-performance-comments-container'>
                        <h3>You'r Good</h3>
                        <p>Your sales performance is better than 30% of other users</p>
                    </div>
                </div>
            )}
        </div>
        // </div>
    )
}

export default SalesPerformance
