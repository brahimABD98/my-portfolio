import { component$ } from "@builder.io/qwik";
import { Avatar } from "@boringer-avatars/qwik";

interface UserAvatarProps {
    name: string;
    size?: number;
}


export const UserAvatar = component$((props: UserAvatarProps) => {
    return (
        <Avatar
            title={false}
            size={props.size || 48}
            variant="beam"
            name={props.name}
            square={false}
            colors={[
                "#FFAD08",
                "#EDD75A",
                "#73B06F",
                "#0C8F8F",
                "#405059",
            ]}
        />
    )
})