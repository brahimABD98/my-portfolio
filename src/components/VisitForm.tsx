import { component$, useStore, type QwikSubmitEvent, useVisibleTask$, event$, useSignal } from "@builder.io/qwik";
import { ToastMessage } from "./ToastMessage";
import { getCookie } from "../utils/cookies";
const API_BASE_URL = import.meta.env.PUBLIC_API_URL;

const fetchUserFromGithub = async (token: string): Promise<string> => {
    try {
        const res = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${token ?? ""}`
            }
        });
        const data = await res.json();
        return data.login as string ?? "";
    } catch (e) {
        throw Error("error while getting user");
    }
}


export const VisitForm = component$(() => {
    const visitData = useStore({
        username: "",
        note: ""
    })
    const isProcessing = useSignal(false);
    const isVisible = useSignal(true);
    const showToast = useSignal(false);

    useVisibleTask$(async ({ track }) => {
        track(() => isVisible.value)
        console.log("is visible", isVisible.value)
        const token = getCookie("token");
        if (!token) {
            isVisible.value = false;
            return () => { };
        }
        try {
            const data = await fetchUserFromGithub(token);
            visitData.username = data;
        } catch (e) {
            console.log(e)
        }
        return () => { };

    })
    const handleSubmit = event$(async (event: QwikSubmitEvent, form: HTMLFormElement) => {
        isProcessing.value = true;
        const data = new FormData(form);
        const { note } = Object.fromEntries(data.entries());
        const is_public = data.get("is_public") === "on";


        const req = await fetch(`${API_BASE_URL}/visitbook`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                note,
                username: visitData.username,
                is_public
            })
        })

        if (req.status != 201) {
            isProcessing.value = false;
            alert("something went wrong")
        }

        isProcessing.value = false;
        form.reset();
        showToast.value = true;
    });

    return (
        <>
            <form onSubmit$={handleSubmit} preventdefault:submit class="mt-4 flex flex-col space-y-4">
                <fieldset class="space-y-2">
                    <legend class="text-2xl font-bold">Submit a Note</legend>
                    <div class="form-control p-4 bg-base-300 rounded-md">

                        <div class="tooltip tooltip-left tooltip-success w-full flex flex-col items-start justify-start" data-tip="you can't change this !">
                            <label for="username" class="label">
                                <span class="label-text" >Username:</span>
                            </label>
                            <input
                                type="text"
                                class="input input-bordered md:w-1/2"
                                name="username"
                                id="username"
                                required
                                readOnly
                                value={visitData.username}
                            />
                        </div>
                    </div>
                    <div class="form-control p-4 bg-base-300 rounded-md">
                        <label for="note" class="label">
                            <span class="label-text">Note:</span>
                        </label>
                        <textarea
                            class="textarea textarea-bordered h-24 w-full"
                            name="note"
                            id="note" required />
                    </div>
                    <div class="form-control p-4 md:w-1/3 bg-base-300 rounded-md ">
                        <label class="label cursor-pointer">
                            <div class="tooltip" data-tip="Everyone will be able to see your username and the note" >
                                <span class="label-text " >Make this public  &#x2139; </span>
                            </div>
                            <input name="is_public" id="is_public" type="checkbox" class="checkbox checkbox-primary" />
                        </label>
                    </div>

                    {isVisible.value &&
                        <div class="form-control p-4">
                            <button disabled={isProcessing.value} type="submit" class="btn btn-primary md:w-24">
                                Submit
                            </button>
                        </div>
                    }
                </fieldset>
            </form>
            {showToast.value &&
                <ToastMessage message="Note submitted successfully" type="info" timeout={2500} />
            }
        </>
    )
})


