export default function Record(props) {
  async function deleteRecord() {
    const token = sessionStorage.getItem('token')
    const conf = window.confirm('Are you sure you want to delete that record?')
    if (conf) {
      const response = await fetch(
        'http://127.0.0.1:5000/api/companies/' + props.id,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      const data = await response.json()
      if (data.id) {
        var row = document.getElementById(props.id)
        row.parentNode.removeChild(row)
      } else {
        alert('Internal server error')
      }
    }
  }
  return (
    <tr id={props.id}>
      <td>{props.symbol}</td>
      <td>{props.name}</td>
      <td>
        <button
          onClick={() => {
            deleteRecord(props.id)
          }}
        >
          usuń
        </button>
      </td>
    </tr>
  )
}
