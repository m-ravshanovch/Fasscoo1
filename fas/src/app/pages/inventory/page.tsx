"use client"
import axios from "axios"
import Link from "next/link"
import { useState, useEffect } from "react"
import * as XLSX from 'xlsx'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

interface ImportData {
    id: number | string;
    name: string;
    quantity: number;
    cost: number;
    sell: number;
    sum: number;
    date: string;
}

export default function Home() {
    const [search, setSearch] = useState("")
    const [importData, setImportData] = useState<ImportData[]>([])

    useEffect(() => {
        axios.get("http://172.20.10.2:5000/Import/")
            .then((res) => {
                const reversedData = res.data.reverse();
                setImportData(reversedData);
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const filteredData = importData.filter((item) => 
        item?.name?.toLowerCase().includes(search.toLowerCase()) || false
    )

    const exportToExcel = () => {
        const exportData = filteredData.map(item => ({
            ID: item.id,
            Name: item.name,
            Quantity: item.quantity,
            Cost: item.cost,
            Sell: item.sell,
            Sum: item.sum,
            Date: item.date,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Import Data");

        XLSX.writeFile(wb, "import_data.xlsx");
    };

    return (
        <div className="p-2 place-items-center w-full border-2 grid grid-cols-1 gap-y-3 py-5">
            <div className="w-full flex justify-end">
                <button className="rounded-lg text-xl border-2 border-solid border-[#0D1633] active:opacity-80">
                    <Link href={'/pages/inventory/inventoryPlus/'} className="px-3">+</Link>
                </button>
            </div>
            <div className="w-full place-items-center ">
                <div className="font-bold text-4xl text-center">СКЛАД</div>
                <div className="grid grid-cols-2 gap-x-3 mt-4 p-5 w-full">
                    <button className=" bg-[#0D1633] text-white rounded-md text-center">
                        <Link href={'/pages/inventory/coming/'} className=" text-xl  block active:opacity-80 text-center">приход</Link>
                    </button>
                    <button className=" bg-[#0D1633] text-white rounded-md text-center">
                        <Link href={'/pages/inventory/products/'} className=" text-xl block active:opacity-80">продажа</Link>
                    </button>
                </div>
            </div>
            <div className="w-full grid grid-cols-1 items-center place-items-center gap-y-2 md:grid-cols-2 p-5 gap-x-3">
                <input 
                    type="text" 
                    placeholder="поиск" 
                    onChange={e => setSearch(e.target.value)} 
                    className="border-2 border-[#0D1633] border-solid rounded-md md:w-[60%] py-1 text-center"
                />
                 <button
                    onClick={exportToExcel}  
                    className=" rounded-lg md:w-[60%]   bg-[#0D1633] text-white py-1 px-4 text-lg"
                >
                    <CloudDownloadIcon/>
                </button>
            </div>
            <div className="w-full overflow-x-scroll    ">
                
                <table className="w-full border-2  ">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th className="text-left">ОБЩИЙ</th>
                            <th>Кол-во</th>
                            <th className="text-right">Итого sum</th>
                        </tr>
                    </thead>
                    <tbody className="border-2">
                        {filteredData.map((res, index) => (
                            <tr key={index}>
                                <td className="border-2">
                                    {res.id}
                                </td>
                                <td className="border-2">
                                    {res.name}
                                </td>
                                <td className="border-2 text-center">
                                    {res.quantity}
                                </td>
                                <td className="border-2 text-right">
                                    {res.sum} <span>sum</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
