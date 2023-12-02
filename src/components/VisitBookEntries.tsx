import {
    Resource,
    component$,
    $,
    useResource$,
    useSignal,
} from "@builder.io/qwik";
import { UserAvatar } from "./Avatar";
import { DisplayLongText } from "./DisplayLongText";
import { getCookie } from "../utils/cookies";
import { ToastMessage } from "./ToastMessage";

const API_BASE_URL = import.meta.env.PUBLIC_API_URL;

interface Entry {
    id: string;
    username: string;
    note: string;
}

const randomColor = () => {
    const colors = [
        "border-green-500",
        "border-yellow-500",
        "border-red-500",
        "border-pink-500",
        "border-purple-500",
        "border-indigo-500",
        "border-blue-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const VisitBookEntries = component$(() => {
    const entries = useResource$<Entry[]>(async ({ cleanup }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/visitbook`);
            const data = await response.json();
            const controller = new AbortController();
            cleanup(() => controller.abort());
            return data as Entry[];
        } catch (error) {
            return [];
        }
    });

    return (
        <div class="overflow-auto md:min-w-64 h-64">
            <Resource
                value={entries}
                onRejected={() => <div>Failed to load entries!</div>}
                onPending={() => <span class="loading loading-dots loading-lg"></span>}
                onResolved={(entries) => (
                    <>
                        {entries.length === 0 ? (
                            <div>No entries available.</div>
                        ) : (
                            entries.map((entry) => (
                                <EntryCard key={entry.id} entry={entry} />
                            ))
                        )}
                    </>
                )}
            />
        </div>
    );
});

const EntryCard = ({ entry }: { entry: Entry }) => (
    <div class={`flex justify-between items-center p-4 border-l-4 ${randomColor()} bg-base-200 rounded shadow mb-4`}>
        <div class="flex">
            <div class="avatar">
                <UserAvatar size={36} name={entry.username} />
            </div>
            <div class="ml-4 ">
                <h2 class="font-bold text-xl mb-2">{entry.username}</h2>
                <DisplayLongText text={entry.note} threshold={200} />
            </div>
        </div>
        <div>
            <DeleteButton id={entry.id} username={entry.username} />
        </div>
    </div>
);

interface DeleteButtonProp {
    id: string
    username: string
}

const DeleteButton = component$((props: DeleteButtonProp) => {
    const is_visible = useSignal(false);
    const deleteEntry = $(async () => {
        const token = getCookie("token");
        if (!token) {
            alert("no authenticated");
            return;
        }
        const res = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        const is_Owner = data.login === props.username;
        if (!is_Owner) {
            alert("You can't delete this entry")
            return;
        }
        try {

            const req = await fetch(`${API_BASE_URL}/visitbook/${props.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST,PATCH,DELETE,OPTIONS'
                },
                method: "DELETE"
            })
            if (req.status == 202) {
                // alert("Failed to delete entry")
                window.location.reload();
                is_visible.value = true;
            }
            console.log({ req })
        } catch (e) {
            console.log(e);
        }
    });
    return (
        <>
            <button onClick$={deleteEntry}>
                <img class="w-8" src="/delete.svg" alt="delete icon" />
            </button>
            {is_visible.value &&

                <ToastMessage message="Entry deleted successfully" type="success" timeout={2500} reload_on_close={false} />
            }

        </>
    )
})
