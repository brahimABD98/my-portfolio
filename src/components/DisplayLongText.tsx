import { component$, useSignal, $ } from "@builder.io/qwik";

export interface DisplayLongTextProps {
    text: string,
    threshold: number
}
export const DisplayLongText = component$((props: DisplayLongTextProps) => {
    const isClamped = useSignal(false);
    const toggleClamp = $(() => {
        isClamped.value = !isClamped.value;
    });
    return (
        <>
            <p class={isClamped.value ? "" : "line-clamp-2"}>
                {props.text}
            </p >
            {props.text.length > props.threshold &&

                <button class="btn btn-link" onClick$={toggleClamp}>
                    {isClamped.value ? 'collapse' : 'expand'}
                </button>
            }
        </>
    );
});
