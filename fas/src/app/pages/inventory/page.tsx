"use client"
import axios from "axios"
import Link from "next/link"
import { useState, useEffect } from "react"
export default function Home() {
    const [search,setSearch]=useState("")
    const [importData, setImportData] = useState<{ id: number, name: string, cost: number, fromWhere: string, toWhere: string, sold: number }[]>([])
    useEffect(() => {
        axios.get("http://172.18.0.55:5000/Import/").then((res) => {
            setImportData(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    const filteredData = importData.filter((item)=>(
        item.name.toLowerCase().includes(search.toLowerCase())
    ))
    return (
        <div className="p-2 place-items-center w-full grid grid-cols-1 gap-y-3 py-5">
            <div className="w-full flex justify-end">
                <button className="rounded-lg text-xl border-2 border-solid border-[#0D1633] active:opacity-80 "><Link href={'/pages/inventory/inventoryPlus/'} className="px-3">+</Link></button>
            </div>
            <div className="w-full place-items-center">
                <div className="font-bold text-4xl text-center ">СКЛАД</div>
                <div className="flex gap-x-5 justify-center mt-4">
                    <button className="px-1 bg-[#0D1633] text-white rounded-md"><Link href={'/pages/inventory/coming/'} className="w-44 text-xl py-1 block active:opacity-80">приход</Link></button>
                    <button className="px-3 bg-[#0D1633] text-white rounded-md"><Link href={'/pages/inventory/products/'} className="w-44 text-xl py-1 block active:opacity-80">продажа</Link></button>
                </div>
            </div>
            <div className="w-full flex justify-center ">
                <input type="text" placeholder="поиск" onChange={e=>setSearch(e.target.value)} className="border-2 border-[#0D1633] border-solid rounded-md w-64 py-1 text-center"/>
            </div>
            <div className="w-full">
                <table className="w-full border-2 place-items-center">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th className="text-left">ОБЩИЙ</th>
                            <th>66</th>
                            <th className="text-right">66000 so’m</th>
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

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
