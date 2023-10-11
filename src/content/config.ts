import { z, defineCollection } from "astro:content";

const projectSchema = ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.string().optional(),
    heroImage: image().refine((img) => img.width >= 200, {
        message: 'Cover image must be at least 1080 pixels wide!',
    }),
    aspectRatio: z.number().optional(),
    height: z.number().optional(),
    width: z.number().optional(),

});



const projectCollection = defineCollection({ schema: projectSchema });


export const collections = {
    'project': projectCollection

}