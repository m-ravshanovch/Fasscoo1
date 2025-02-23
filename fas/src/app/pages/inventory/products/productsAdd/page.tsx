"use client"
import axios from "axios"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
export default function Home() {
  const [importData, setImportData] = useState<{
    id: number,
    name: string,
    cost: number,
    paymentType: string,
    client: string,
    sold: number,
    date: string
  }[]>([])
  const [option, setOption] = useState<{ name: string }[]>([])
  const [client, setClient] = useState<{ name: string }[]>([])
  const [payType, setPayType] = useState<{ name: string }[]>([])
  const [values,setValues]=useState({
    name:"",
    sold:0,
    cost:0,
    client:"",
    paymentType:"",
    date:""
  })
  useEffect(() => {
    axios.get("http://172.18.0.55:5000/ExportHolder/")
      .then((res) => {
        setImportData(res.data)
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    axios.get("http://172.18.0.55:5000/Medicine/").then((res) => {
      setOption(res.data)
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  useEffect(() => {
    axios.get("http://172.18.0.55:5000/Client/").then((res) => {
      setClient(res.data)
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }, [])
  useEffect(() => {
    axios.get("http://172.18.0.55:5000/PaymentType/").then((res) => {
      setPayType(res.data)
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  // const optionn = option.map((item) => {
  //   return item.name
  // })
  const heandleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]:e.target.value
    })
  }
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    try {
      const response= await axios.post("http://172.18.0.55:5000/ExportHolder/",values,{headers:{"Content-Type":"application/json"}});
      console.log("Success:",response)
      setValues({
        name:"",
        sold:0,
        cost:0,
        client:"",
        paymentType:"",
        date:""
      })
    }catch(error){
      console.error(error)
      alert("so bo'lasiz")
    }
  }
  console.log(values)

  return (
    <div className="md:p-2 place-items-start md:place-items-center w-full grid grid-cols-1 gap-y-3 py-5">
      <div className="w-full flex justify-end">
        <button className="px-3 rounded-lg text-xl active:opacity-80">
          <Link href={'/pages/inventory/'}>
            <Image src={'/back-button.png'} width={32} height={32} alt="back-button" />
          </Link>
        </button>
      </div>

      <div className="font-bold text-4xl text-left md:text-center p-3">
        продажа<br /> <span className="text-zinc-400 text-xl">список</span>
      </div>
      <form id="1" onSubmit={handleSubmit} className="w-full place-items-center p-1" >
        <div className=" grid grid-cols-2 md:grid-cols-6 gap-3">
          <div>
            <label htmlFor="" className="block font-medium">Лек.</label>


            <input type="text" list="medicine-list" onChange={heandleChange} className=" w-full border-2 border-gray-600 px-2 text-lg rounded-md" />
            <datalist id="medicine-list">
              {option.map((res, i) => (
                <option key={i} value={res.name}></option>
              ))}
            </datalist>

          </div>

          <div>
            <label htmlFor=""  className="block font-medium">кол.</label>
            <input type="number"  onChange={heandleChange} className=" w-full border-2  border-gray-600 px-2 text-lg rounded-md" />
          </div>
          <div>
            <label htmlFor="" className="block font-medium">цена.</label>
            <input type="number"  onChange={heandleChange} className=" w-full border-2 border-gray-600 px-2 text-lg rounded-md" />
          </div>
          <div>
            <label htmlFor=""  className="block font-medium">сумма.</label>
            <input type="number"  onChange={heandleChange} className=" w-full border-2 border-gray-600 px-2 text-lg rounded-md" />
          </div>
          <div>
            <label htmlFor="" className="block font-medium">клиент.</label>
            <input type="text" list="client-list" onChange={heandleChange} className=" w-full border-2 border-gray-600 px-2 text-lg rounded-md" />
            <datalist id="client-list">
              {client.map((res, i) => (
                <option key={i} value={res.name}></option>
              ))}
            </datalist>
          
          </div>
          <div>
            <label htmlFor="" className="block font-medium">Типоплаты.</label>
            <input type="text" list="pay-list" onChange={heandleChange} className=" w-full border-2 border-gray-600 px-2 text-lg rounded-md" />
            <datalist id="pay-list">
              {payType.map((res, i) => (
                <option key={i} value={res.name}>{res.name}</option>
              ))}
            </datalist>
          
          </div>
          <div>
            <label htmlFor="" className="block font-medium">дата.</label>
            <input type="text" onChange={heandleChange} className=" w-full border-2 border-gray-600 px-2 text-lg rounded-md" />
          </div>
        </div>
        <div className="w-full flex justify-end mt-3">
          <button type="submit" className="px-3 bg-[#0D1633] text-white rounded-lg w-60 md:w-44 py-1">
            добавить
          </button>
        </div>
      </form>

      <div className="w-full overflow-scroll ">
        <table className="w-full border-2 place-items-center">
          <thead >
            <tr className="border-2 ">
              <th className="text-left border-2">ID</th>
              <th className="text-left border-2">Лек.</th>
              <th>кол.</th>
              <th className="text-right border-2">цена</th>
              <th className="text-right border-2">сумма</th>
              <th className="text-right border-2">клиент</th>
              <th className="text-right border-2">Типоплаты</th>
              <th className="text-right border-2">дата</th>
            </tr>
            <tr  >
              <th className="text-left border-2">ОБЩИЙ</th>
              <th className="text-left"></th>
              <th className="border-2"></th>
              <th className="text-right border-2"></th>
              <th className="text-right border-2"> sum</th>
              <th className="text-right border-2"></th>
              <th className="text-right border-2"></th>
              <th className="text-right border-2"></th>
            </tr>
          </thead>
          <tbody className="border-2">
            {importData.map((res) => (
              <tr key={res.id} >
                <td className="border-2">{res.id}</td>
                <td className="border-2">{res.name}</td>
                <td className="border-2 text-center">{res.sold}</td>
                <td className="border-2 text-right">{res.cost}</td>
                <td className="border-2 text-right">{res.cost * res.sold} sum</td>
                <td className="border-2 text-right">{res.client}</td>
                <td className="border-2  text-center md:text-right">{res.paymentType}</td>
                <td className="border-2 text-right">{res.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}