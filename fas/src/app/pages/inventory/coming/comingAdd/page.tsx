'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // added import
import Link from "next/link";
import Image from "next/image";

interface ComingItem {
    id: number;
    name: string;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
    sum: number;
    date: string;
}

export default function MedicinesPage() {
    const router = useRouter(); // initialize router
    const [medicineName, setMedicineName] = useState("");
    const [quantity, setQuantity] = useState(""); // changed from number to string
    const [purchasePrice, setPurchasePrice] = useState(""); // changed from number to string
    const [sellingPrice, setSellingPrice] = useState(""); // changed from number to string
    const [sum, setSum] = useState(""); // changed from number to string
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [comingItems, setComingItems] = useState<ComingItem[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Fetch initial comingAdd items from json-server
    useEffect(() => {
        fetch("http://172.18.0.55:5000/comingAdd")
            .then((res) => res.json())
            .then((data) => setComingItems(data))
            .catch((err) => console.error("Error fetching comingAdd items:", err));
    }, []);

    const handleAdd = () => {
        if (medicineName.trim()) {
            const newItem: Omit<ComingItem, "id"> = {
                name: medicineName.trim(),
                quantity: Number(quantity),
                purchasePrice: Number(purchasePrice),
                sellingPrice: Number(sellingPrice),
                sum: Number(sum),
                date,
            };

            fetch("http://172.18.0.55:5000/comingAdd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            })
                .then((res) => res.json())
                .then((createdItem) => {
                    // Add the new item at the beginning of the comingItems list
                    setComingItems((prev) => [createdItem, ...prev]);
                    // Reset inputs
                    setMedicineName("");
                    setQuantity("");
                    setPurchasePrice("");
                    setSellingPrice("");
                    setSum("");
                    setDate(new Date().toISOString().split("T")[0]);
                })
                .catch((err) => console.error("Error adding item:", err));
        }
    };

    const handleRemove = (id: number) => {
        fetch(`http://172.18.0.55:5000/comingAdd/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                setComingItems((prev) => prev.filter((item) => item.id !== id));
            })
            .catch((err) => console.error("Error removing item:", err));
    };

    const handleEdit = (item: ComingItem) => {
        setEditingId(item.id);
        setMedicineName(item.name);
        setQuantity(`${item.quantity}`); // convert number to string
        setPurchasePrice(`${item.purchasePrice}`);
        setSellingPrice(`${item.sellingPrice}`);
        setSum(`${item.sum}`);
        setDate(item.date);
    };

    const handleUpdate = () => {
        if (editingId !== null && medicineName.trim()) {
            const originalItem = comingItems.find((item) => item.id === editingId);
            if (!originalItem) return;
            const updatedItem = {
                ...originalItem,
                name: medicineName.trim(),
                quantity: Number(quantity),
                purchasePrice: Number(purchasePrice),
                sellingPrice: Number(sellingPrice),
                sum: Number(sum),
                date
            };

            fetch(`http://172.18.0.55:5000/ImportHolder/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedItem),
            })
                .then((res) => res.json())
                .then((data) => {
                    setComingItems((prev) =>
                        prev.map((item) => (item.id === editingId ? data : item))
                    );
                    // Reset inputs
                    setMedicineName("");
                    setQuantity("");
                    setPurchasePrice("");
                    setSellingPrice("");
                    setSum("");
                    setDate(new Date().toISOString().split("T")[0]);
                    setEditingId(null);
                })
                .catch((err) => console.error("Error updating item:", err));
        }
    };

    // New function to save all items to "coming"
    const handleSaveAll = async () => {
        try {
            await Promise.all(comingItems.map(item => {
                return fetch("http://172.18.0.55:5000/Import", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(item),
                });
            }));
            router.push("/pages/inventory/coming"); // redirect after save
        } catch (err) {
            console.error("Ошибка при сохранении товаров", err);
            alert("Ошибка при сохранении товаров");
        }
    };

    return (
        <div className="flex flex-col items-center w-screen p-6">
            <div className="absolute top-4 right-4">
                <Link href="/pages/inventory/coming/">
                    <Image
                        src="/back-button.png"
                        width={32}
                        height={32}
                        alt="back-button"
                    />
                </Link>
            </div>
            <h1 className="text-2xl font-bold mb-4">Добавить лекарство</h1>

            <div className="flex flex-col w-full max-w-md space-y-2 mb-4">
                <input
                    type="text"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    className="border border-[#0D1633] rounded-lg text-xl p-2 font-semibold"
                    placeholder="Введите название..."
                />
                <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="border border-[#0D1633] rounded-lg text-xl p-2 font-semibold"
                    placeholder="Введите количество..."
                />
                <input
                    type="text"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="border border-[#0D1633] rounded-lg text-xl p-2 font-semibold"
                    placeholder="Введите закупочную цену..."
                />
                <input
                    type="text"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="border border-[#0D1633] rounded-lg text-xl p-2 font-semibold"
                    placeholder="Введите продажную цену..."
                />
                <input
                    type="text"
                    value={sum}
                    onChange={(e) => setSum(e.target.value)}
                    className="border border-[#0D1633] rounded-lg text-xl p-2 font-semibold"
                    placeholder="Введите сумму..."
                />
                <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-[#0D1633] rounded-lg text-xl p-2 font-semibold"
                    placeholder="yyyy-mm-dd"
                />
                {editingId === null ? (
                    <button
                        onClick={handleAdd}
                        className="border border-[#0D1633] bg-[#0D1633] rounded-lg text-white text-sm p-2"
                    >
                        добавить
                    </button>
                ) : (
                    <button
                        onClick={handleUpdate}
                        className="border border-[#0D1633] bg-[#0D1633] rounded-lg text-white text-sm p-2"
                    >
                        обновить
                    </button>
                )}
            </div>

            <p className="mb-2">Количество лекарств: {comingItems.length}</p>

            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Название</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Количество</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Закуп. Цена</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Прод. Цена</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Сумма</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Дата</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {comingItems.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.purchasePrice}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.sellingPrice}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.sum}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                    <button onClick={() => handleEdit(item)} className="mr-2">
                                        <Image
                                            src="/edit.png"
                                            width={24}
                                            height={24}
                                            alt="edit"
                                        />
                                    </button>
                                    <button onClick={() => handleRemove(item.id)}>
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

            {/* New "сохранить" button */}
            <div className="mt-4">
                <button 
                    onClick={handleSaveAll} 
                    className="border border-[#0D1633] bg-[#0D1633] text-white rounded-lg text-sm p-2">
                    сохранить
                </button>
            </div>
        </div>
    );
}