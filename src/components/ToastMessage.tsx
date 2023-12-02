import { component$, useVisibleTask$, useSignal, type Component } from "@builder.io/qwik";

export interface ToastMessageProps {
    message: string;
    type: "success" | "error" | "warning" | "info";
    /**
     * (Optional) the time in milliseconds after which the toast will be closed.
     */
    timeout?: number;
    /**
    * (Optional) true by default the page will be reloaded when the user closes the toast.
    * If set to false the page will not be reloaded.
    */
    reload_on_close?: boolean;
}

/**
 * A toast message component.
 * 
 * usage example:
 * ```tsx
 * <ToastMessage 
 *      message="Note submitted successfully" 
 *      type="success"/>
 * ```
 * 
 * you can disable the auto reload by setting the `reload_on_close` prop to false.
 * ```tsx
 * <ToastMessage    
 *      message="Note submitted successfully" 
 *      type="success" timeout={2500} 
 *      reload_on_close={false} />
 * ```
 */
export const ToastMessage = component$((props: ToastMessageProps) => {
    const is_visible = useSignal(true);
    const timeout = props.timeout ?? 3000;
    const reload = props.reload_on_close ?? true;

    useVisibleTask$(({ cleanup }) => {
        if (is_visible.value === false) return () => { };
        const id = setTimeout(() => {
            is_visible.value = false;
            if (reload)
                window.location.reload();
        }, timeout);

        return cleanup(() => clearTimeout(id));

    });
    return (
        <>
            <div class="toast toast-top toast-end">
                <div class={`alert alert-${props.type}`}>
                    <span>{props.message}</span>
                </div>
            </div>
        </>
    );

});
