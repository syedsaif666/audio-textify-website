"use client";
import { ReactNode, useEffect, useState } from 'react';
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';


interface Props {
    title: string;
    description?: string;
    footer?: ReactNode;
    formId?: string;
    input?: ReactNode;
    serverAction: (data: FormData) => Promise<unknown>
    children: ReactNode;
}

interface ApiResponse {
    name: string;
    message: string;
    status: number;

}

export default function InputCard({
    title,
    description,
    footer,
    children,
    formId,
    input,
    serverAction
}: Props) {

    // const [error, setError] = useState<unknown>();

    return (
        <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
            <ToastContainer
                transition={Flip}
                position="bottom-right"
                autoClose={3000}
                limit={4}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" />
            <div className="px-5 py-4">
                <h3 className="mb-1 text-2xl font-medium">
                    {title}</h3>
                <p className="text-zinc-300">
                    {description}</p>
                {children}

                <div className="mt-8 mb-4 font-semibold ">
                    <form id={formId}
                        action={
                            async (formData: FormData) => {

                                // console.log("FORMDATA: ", formData)
                                const res: any = await serverAction(formData);
                                // console.log(res)
                                // console.log(typeof (res))
                                // console.log("----------------------------")
                                if (res) {
                                    switch (res.action) {
                                        case "updateName":
                                            alert(res.status);
                                            break;
                                        case "updateEmail":
                                            if (res.status.name == "AuthApiError") {
                                                alert(res.status.message);
                                            }
                                            else if (res.status.user) {
                                                alert("Email Changed Successfully")
                                            }
                                            break;
                                        case "updatePassword":
                                            if (res.status.name == "AuthApiError") {
                                                alert(res.status.message);
                                            }
                                            else if (res.status.user) {
                                                alert("Password Changed Successfully")
                                            }

                                            break;
                                    }

                                }
                                {/*  
                                if (res.name == "AuthApiError") {
                                    alert(res.message);
                                }
                                else if (res.user) {
                                    alert("Password Changed!")
                                }
                                */ }
                            }

                        }
                    >
                        {input}
                    </form>
                </div>
            </div>
            <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
                {footer} </div>
        </div>
    );
}
