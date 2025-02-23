'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

interface productsItem {
    id: number | string,
    name: string,
    cost: number,
    sold: number,
    client: string,
    paymentType: string,
    date: string,
}

export default function MedicinesPage() {
    const router = useRouter();
    const [name, setname] = useState("");
    const [sold, setsold] = useState<number>(0);
    const [cost, setcost] = useState<number>(0);
    // const [sum, setSum] = useState<number>(0);
    const [client, setClient] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [ProductsItems, setProductsItems] = useState<productsItem[]>([]);
    const [editingId, setEditingId] = useState<number | string | null>(null);
    const [madecine, setMedecine] = useState<{ name: string }[]>([]);
    const [clientS, setClientS] = useState<{ name: string }[]>([]);
    const [payType, setPayType] = useState<{ name: string }[]>([]);

    useEffect(() => {
        axios.get("http://172.20.10.2:5000/ExportHolder")
            .then((response) => {
                const items = response.data.map((item: { cost: number; sell: number; id: number | string; name: string; sold: number; sum: number; date: string }) => ({
                    ...item,
                    purchasePrice: item.cost,
                    cost: item.sell,
                }));
                setProductsItems(items);
            })
            .catch((err) => console.error("Error fetching ExportHolder items:", err));
    }, []);

    const handleAdd = () => {
        if (name.trim()) {
            const newItem = {
                name: name.trim(),
                sold,
                sell: cost,
                client,
                paymentType,
                date,
            };

            axios.post("http://172.20.10.2:5000/ExportHolder", newItem)
                .then((response) => {
                    const responseItem = {
                        ...response.data,
                        purchasePrice: response.data.cost,
                        cost: response.data.sell,
                    };
                    setProductsItems((prev) => [responseItem, ...prev]);
                    // Reset inputs
                    setname("");
                    setsold(0);
                    setcost(0);
                    setClient("");
                    setPaymentType("");
                    setDate(new Date().toISOString().split("T")[0]);
                })
                .catch((err) => console.error("Error adding item:", err));
        }
    };

    const handleRemove = (id: number | string) => {
        axios.delete(`http://172.20.10.2:5000/ExportHolder/${id}`)
            .then(() => {
                setProductsItems((prev) => prev.filter((item) => item.id !== id));
            })
            .catch((err) => console.error("Error removing item:", err));
    };

    const handleEdit = (item: productsItem) => {
        setEditingId(item.id);
        setname(item.name);
        setsold(item.sold);
        setcost(item.cost);
        setDate(item.date);
        setClient(item.client);
        setPaymentType(item.paymentType);
    };

    const handleUpdate = () => {
        if (editingId !== null && name.trim()) {
            const originalItem = ProductsItems.find((item) => item.id === editingId);
            if (!originalItem) return;
            const updatedItem = {
                ...originalItem,
                name: name.trim(),
                sold,
                sell: cost,
                client,
                paymentType,
                date
            };

            axios.put(`http://172.20.10.2:5000/ExportHolder/${editingId}`, updatedItem)
                .then((response) => {
                    const responseItem = {
                        ...response.data,
                        purchasePrice: response.data.cost,
                        cost: response.data.sell,
                    };
                    setProductsItems((prev) =>
                        prev.map((item) => (item.id === editingId ? responseItem : item))
                    );
                    // Reset inputs
                    setname("");
                    setsold(0);
                    setcost(0);
                    setClient("");
                    setPaymentType("");
                    setDate(new Date().toISOString().split("T")[0]);
                    setEditingId(null);
                })
                .catch((err) => console.error("Error updating item:", err));
        }
    };

    const handleSaveAll = async () => {
        try {
            await Promise.all(ProductsItems.map(async (item) => {
                const formattedItem = {
                    id: item.id,
                    name: item.name,
                    sold: item.sold,
                    cost: item.cost,
                    client: item.client,
                    paymentType: item.paymentType,
                    date: item.date
                };
                await axios.post("http://172.20.10.2:5000/Export", formattedItem);
                await axios.delete(`http://172.20.10.2:5000/ExportHolder/${item.id}`);
            }));
            router.push("/pages/inventory/products");
        } catch (err) {
            console.error("Ошибка при сохранении товаров", err);
            alert("Ошибка при сохранении товаров");
        }
    };

    useEffect(() => {
        axios.get("http://172.20.10.2:5000/Medicine")
            .then((res) => {
                setMedecine(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])
    useEffect(() => {
        axios.get("http://172.20.10.2:5000/Client")
            .then((res) => {
                setClientS(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])
    useEffect(() => {
        axios.get("http://172.20.10.2:5000/PaymentType")
            .then((res) => {
                setPayType(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])
    const totalSum = ProductsItems.reduce((acc, item) => acc + Number(item.sold) * Number(item.cost), 0);
    const totalSold = ProductsItems.reduce((acc, item) => acc + Number(item.sold), 0);
    return (
        <div className="w-full p-6 mt-8">
            <div className="absolute top-4 right-4">
                <Link href="/pages/inventory/products/">
                    <Image
                        src="/back-button.png"
                        width={32}
                        height={32}
                        alt="back-button"
                    />
                </Link>
            </div>
            <h1 className="text-4xl font-bold mb-4">продажа</h1>

            <div className="w-full">
                <div className="grid grid-cols-2 md:grid-cols-7 gap-x-4 gap-y-4">
                    <div>
                        <label>Лек.</label>
                        <input
                            list="medicine-list"
                            type="text"
                            title="Название лекарства"
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                            className="border-2 w-full border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                        />
                        <datalist id="medicine-list">
                            {madecine && madecine.map((res, i) => (
                                <option key={i} value={res.name}></option>
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label>кол.</label>
                        <input
                            type="number"
                            title="Количество"
                            value={sold === 0 ? "" : sold} // added value prop
                            onChange={(e) =>
                                setsold(e.target.value === "" ? 0 : e.target.valueAsNumber)
                            }
                            className="border-2 w-full border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                        />
                    </div>
                    <div>
                        <label>ц. прод.</label>
                        <input
                            type="number"
                            title="Цена"
                            value={cost === 0 ? "" : cost} // added value prop
                            onChange={(e) =>
                                setcost(e.target.value === "" ? 0 : e.target.valueAsNumber)
                            }
                            className="border-2 w-full border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                        />
                    </div>
                    <div>
                        <label>Сумма</label>
                        <input
                            type="number"
                            title="Сумма"
                            value={cost * sold}
                            className="border-2 w-full border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                            readOnly
                        />
                    </div>
                    <div>
                        <label>клиент</label>
                        <input
                            type="text"
                            title="Клиент"
                            list="client"
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                            className="border-2 w-full border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                        />
                        <datalist id="client">
                            {clientS.map((res,i)=>(
                                <option key={i} value={res.name}></option>
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label>Тип оплаты</label>
                        <input
                            type="text"
                            title="Тип оплаты"
                            list="payType"
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                            className="border-2 w-full border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                        />
                        <datalist id="payType">
                            {payType.map((res,i)=>(
                                <option key={i} value={res.name}></option>
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label>дата.</label>
                        <input
                            type="text"
                            title="Дата"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border-2 w-full border-[#0D1633] rounded-lg text-sm lg:text-xl p-1 font-semibold"
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end w-full mt-5">
                {editingId === null ? (
                    <button
                        onClick={handleAdd}
                        className="border-2 border-[#0D1633] bg-[#0D1633] rounded-lg text-white text-sm lg:text-xl p-1"
                    >
                        добавить
                    </button>
                ) : (
                    <button
                        onClick={handleUpdate}
                        className="border-2 border-[#0D1633] bg-[#0D1633] rounded-lg text-white text-sm lg:text-xl p-1"
                    >
                        обновить
                    </button>
                )}
            </div>

            <p className="mb-2">Количество лекарств: {ProductsItems.length}</p>

            <div className="overflow-x-auto w-full max-w-screen">
                <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Лек.</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Кол.</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Цена</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Сумма</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">клиент</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Типоплаты</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Дата</th>
                            <th className="px-4 py-2"></th>
                        </tr>
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ОБЩИЙ</th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2">{isNaN(totalSold) ? 0 : totalSold}</th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2 text-right">{isNaN(totalSum) ? 0 : totalSum}</th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {ProductsItems.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.sold}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.cost}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{(item.sold) * (item.cost)}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.client}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.paymentType}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                    <button onClick={() => handleEdit(item)} className="mr-2" title="Редактировать">
                                        <Image
                                            src="/edit.png"
                                            width={24}
                                            height={24}
                                            alt="edit"
                                        />
                                    </button>
                                    <button onClick={() => handleRemove(item.id)} title="Удалить">
                                        <Image
                                            src="/delete.png"
                                            width={24}
                                            height={24}
                                            alt="delete"
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 w-full flex justify-end items-center">
                <button
                    onClick={handleSaveAll}
                    className="border-2 border-[#0D1633] bg-[#0D1633] rounded-lg text-white text-sm lg:text-xl p-1">
                    сохранить
                </button>
            </div>
        </div>
    );
}