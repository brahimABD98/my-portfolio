import { z, defineCollection } from "astro:content";

const projectSchema = z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.string().optional(),
    heroImage: z.string().optional(),
    aspectRatio: z.number().optional(),
    height:z.number().optional(),
    width:z.number().optional(),

});


export type projectSchema = z.infer<typeof projectSchema>;

const projectCollection = defineCollection({ schema: projectSchema });


export const collections = {
    'project':projectCollection

}