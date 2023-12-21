export const Options = {
  CloseOpen: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#2a254bcc',
          font: {
            size: 16
          }
        }
      },
      title: {
        display: true,
        text: 'Zmiana notowań zamknięcie - otwarcie',
        color: '#2a254bcc',
        font: {
          size: 16
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          color: '#2a254bcc',
          font: {
            size: 14
          },
        },
        stack: true,
        title: {
          display: true,
          text: 'Data',
          color: '#2a254bcc',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        type: 'linear',
        ticks: {
          color: '#2a254bcc',
          font: {
            size: 14
          }
        },
        title: {
          display: true,
          text: 'Wartość USD',
          color: '#2a254bcc',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  },
  HighLow: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#2a254bcc',
          font: {
            size: 16
          }
        }
      },
      title: {
        display: true,
        text: 'Zmiana notowań kwota najwyższa - kwota najniższa',
        color: '#2a254bcc',
        font: {
          size: 16
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          color: '#2a254bcc',
          font: {
            size: 14
          }
        },
        stack: true,
        title: {
          display: true,
          text: 'Data',
          color: '#2a254bcc',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        type: 'linear',
        ticks: {
          color: '#2a254bcc',
          font: {
            size: 14
          }
        },
        title: {
          display: true,
          text: 'Wartość USD',
          color: '#2a254bcc',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  },
  LostGain: {
    type: 'bar',
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Ilość dni spadku, wzrostu i braku zmian spółki ',
        color: '#2a254bcc',
        font: {
          size: 16
        }
      },
      datalabels: {
        color: '#000',
      },
    }
  },
  ValueDate: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#2a254bcc',
          font: {
            size: 16
          }
        }
      },
      title: {
        display: true,
        text: 'Zmiana notowań spółki, kwota ',
        color: '#2a254bcc',
        font: {
          size: 16
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          color: '#2a254bcc',
          font: {
            size: 14
          }
        },
        stack: true,
        title: {
          display: true,
          text: 'Data',
          color: '#2a254bcc',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        type: 'linear',
        ticks: {
          color: '#2a254bcc',
          font: {
            size: 14
          }
        },
        title: {
          display: true,
          text: 'Wartość USD',
          color: '#2a254bcc',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  }
}
