"use client"
import axios from "axios"
import Link from "next/link"
import { useState, useEffect } from "react"
export default function Home() {
    const [search, setSearch] = useState("")
    // const [filterData,setFilterData]=useState([])
    // const [filterType,setFilterType]=useState("all")
    // const [filterValue,setFilterValue]=useState("")
    // const [data,setData]=useState([])
    const [importData, setImportData] = useState<{ id: number, name: string, cost: number, fromWhere: string, toWhere: string, sold: number,date:string}[]>([])
    useEffect(() => {
        axios.get("http://172.20.10.2:5000/Import").then((res) => {
            setImportData(res.data)
        }).catch((err) => {
            console.log(err.data)
        })
    }, [])
    const filteredData = importData.filter((item) => (
        item.name.toLowerCase().includes(search.toLowerCase()),
        item.date.toLowerCase().includes(search.toLowerCase())
        
    ))
    // useEffect(()=>{
    //     if(!filterValue || filterType==="all"){
    //         setFilterData(data)
    //         return;
    //     }
    //     const filtered =data.filter((item)=>{
    //         const itemDate = new Date(item.date);
    //         if (filterType==="day")return itemDate.getDate()===parseInt(filterValue)
    //         if (filterType==="month")return itemDate.getMonth()+1===parseInt(filterValue)
    //         if (filterType==="year")return itemDate.getFullYear()===parseInt(filterValue)
    //     });
    // setFilterData(filtered)
    // },[filterValue,filterType,data]);
    return (
        <div className="p-2 place-items-center w-full grid grid-cols-1 gap-y-3 py-5">
            <div className="w-full flex justify-end">
                <button className="px-3 rounded-lg text-xl border-2 border-solid border-[#0D1633] active:opacity-80 "><Link href={'/pages/inventoryPlus/'}>+</Link></button>
            </div>
            <div className="font-bold text-4xl text-center ">приход товаров <br /> <span className="text-zinc-400 text-xl">список</span></div>
            <div className="w-full flex justify-center ">
                <input type="text" placeholder="поиск" onChange={e => setSearch(e.target.value)} className="border-2 border-[#0D1633] border-solid rounded-md w-64 py-1 text-center" />
            </div>
            <div className="w-full place-items-center">
                <div className="flex gap-x-5 justify-center mt-4"> 
                    <input type="text" placeholder="поиск" onChange={e => setSearch(e.target.value)} className="border-2 border-[#0D1633] border-solid rounded-md w-64 py-1 text-center" />

                    <button className="px-3 bg-[#0D1633] text-white rounded-md"><Link href={'/pages/comingAdd/'} className="w-44 text-xl py-1 block active:opacity-80">добавить</Link></button>
                </div>
            </div>

            <div className="w-full">
                <table className="w-full border-2 place-items-center">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th className="text-left">ОБЩИЙ</th>
                            <th>66</th>
                            <th className="text-right">66000 so’m</th>
                            <th className="text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="border-2 ">
                        {filteredData.map((res) => (
                            <tr key={res.id} >
                                <td className="border-2">
                                    {res.id}
                                </td>
                                <td className="border-2" >
                                    {res.name}
                                </td>
                                <td className="border-2 text-center">
                                    {res.sold}
                                </td>
                                <td className="border-2 text-right">
                                    {res.cost} <span>sum</span>
                                </td>
                                <td className="border-2 text-right">
                                    {res.date} 
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
