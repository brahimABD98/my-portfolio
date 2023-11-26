import {
    Resource,
    component$,
    useResource$,
    $,
    createElement,
} from "@builder.io/qwik";
import { UserAvatar } from "./Avatar";
import { DisplayLongText } from "./DisplayLongText";

const API_BASE_URL = import.meta.env.API_URL;

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
    const entries = useResource$<Entry[]>(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/visitbook`);
            const data = await response.json();
            return data as Entry[];
        } catch (error) {
            return [];
        }
    });

    return (
        <div class="overflow-auto h-64">
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
    <div
        class={`flex p-4 border-l-4 ${randomColor()} bg-base-200 rounded shadow mb-4`}
    >
        <div class="avatar">
            <UserAvatar size={36} name={entry.username} />
        </div>
        <div class="ml-4">
            <h2 class="font-bold text-xl mb-2">{entry.username}</h2>
            <DisplayLongText text={entry.note} threshold={200} />
        </div>
    </div>
);
