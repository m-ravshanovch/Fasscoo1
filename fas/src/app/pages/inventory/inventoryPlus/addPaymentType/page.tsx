'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

interface PaymentType {
    id: number;
    name: string;
}

export default function PaymentTypePage() {
    const [paymentTypeName, setPaymentTypeName] = useState("");
    const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const API_URL = "http://192.168.0.105:5000/PaymentType";

    // Fetch payment types on component mount
    useEffect(() => {
        fetchPaymentTypes();
    }, []);

    const fetchPaymentTypes = async () => {
        try {
            const response = await axios.get(API_URL);
            setPaymentTypes(response.data);
        } catch (error) {
            console.error("Error fetching payment types:", error);
        }
    };

    const handleAdd = async () => {
        if (paymentTypeName.trim()) {
            try {
                const newPaymentType = {
                    name: paymentTypeName.trim()
                };
                await axios.post(API_URL, newPaymentType);
                setPaymentTypeName("");
                fetchPaymentTypes(); // Refresh the list
            } catch (error) {
                console.error("Error adding payment type:", error);
            }
        }
    };

    const handleRemove = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchPaymentTypes(); // Refresh the list
        } catch (error) {
            console.error("Error removing payment type:", error);
        }
    };

    const handleEdit = (paymentType: PaymentType) => {
        setEditingId(paymentType.id);
        setPaymentTypeName(paymentType.name);
    };

    const handleUpdate = async () => {
        if (editingId !== null && paymentTypeName.trim()) {
            try {
                await axios.put(`${API_URL}/${editingId}`, {
                    id: editingId,
                    name: paymentTypeName.trim()
                });
                setPaymentTypeName("");
                setEditingId(null);
                fetchPaymentTypes(); // Refresh the list
            } catch (error) {
                console.error("Error updating payment type:", error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-screen h-[80vh] p-6">
            <div className="absolute top-4 right-4">
                <Link href="/pages/inventory/inventoryPlus/">
                    <Image src="/back-button.png" width={32} height={32} alt="back-button" />
                </Link>
            </div>
            <h1 className="text-2xl font-bold mb-4">Добавить тип оплаты</h1>

            <div className="flex flex-col justify-center items-end space-y-2 mb-4">
                <input
                    type="text"
                    value={paymentTypeName}
                    onChange={(e) => setPaymentTypeName(e.target.value)}
                    className="border-[#0D1633] border-2 rounded-lg text-xl w-full p-2 font-semibold"
                    placeholder="Введите название..."
                />
                {editingId === null ? (
                    <button
                        onClick={handleAdd}
                        className="border-[#0D1633] bg-[#0D1633] border-2 rounded-lg text-white text-sm w-1/3"
                    >
                        добавить
                    </button>
                ) : (
                    <button
                        onClick={handleUpdate}
                        className="border-[#0D1633] bg-[#0D1633] border-2 rounded-lg text-white text-sm w-1/3"
                    >
                        обновить
                    </button>
                )}
            </div>

            <p className="mb-2">Количество типов оплаты: {paymentTypes.length}</p>

            <ul className="list-decimal list-inside w-full max-w-md">
                {paymentTypes.map((paymentType) => (
                    <li
                        key={paymentType.id}
                        className="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded"
                    >
                        <span className="mr-4 text-xl font-semibold">{paymentType.name}</span>
                        <div className="space-x-2">
                            <button onClick={() => handleEdit(paymentType)}>
                                <Image src="/edit.png" width={32} height={32} alt="edit" />
                            </button>
                            <button onClick={() => handleRemove(paymentType.id)}>
                                <Image src="/delete.png" width={32} height={32} alt="delete" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}