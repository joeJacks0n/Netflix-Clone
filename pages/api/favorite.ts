import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("Received request:", req.method, req.url, req.body);
        if (req.method == 'POST') {
            console.log("post request.")

            console.log('Cookies:', req.cookies);
            console.log('CSRF Token:', req.headers);

            const { currentUser } = await serverAuth(req, res);

            const { movieId } = req.body;

            const exisitngMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId,
                }
            });

            if (!exisitngMovie) {
                throw new Error('Invalid ID');
            }

            const user = await prismadb.user.update({
                where: {
                    email: currentUser.email || '',
                },
                data: {
                    favouriteIds: {
                        push: movieId
                    }
                }
            });

            return res.status(200).json(user);
        }

        if (req.method == 'DELETE') {
            const { currentUser } = await serverAuth(req, res);

            const { movieId } = req.body;

            const exisitngMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId,
                }
            });

            if (!exisitngMovie) {
                throw new Error('Invalid ID');
            }

            const updatedFavoriteIds = without(currentUser.favouriteIds, movieId);

            const updatedUser = await prismadb.user.update({
                where: {
                    email: currentUser.email || '',
                },
                data: {
                    favouriteIds: updatedFavoriteIds
                }
            });

            return res.status(200).json(updatedUser);
        }

        return res.status(405).end();
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}