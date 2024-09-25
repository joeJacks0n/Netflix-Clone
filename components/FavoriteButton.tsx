import axios from 'axios';
//import Cookies from 'js-cookie';

import React, { useCallback, useMemo } from 'react';
import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai';

import useCurrentUser from '@/hooks/useCurrentUser';
import useFavourites from '@/hooks/useFavourites';

import { getSession } from "next-auth/react";

interface FavoriteButtonProps {
    movieId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
    //const csrfToken = Cookies.get('next-auth.csrf-token');


    const { mutate: mutateFavourites } = useFavourites();
    const { data: currentUser, mutate } = useCurrentUser();

    const isFavourite = useMemo(() => {
        const list = currentUser?.favouriteIds || [];

        return list.includes(movieId);
    }, [currentUser, movieId]);

    const toggleFavourites = useCallback(async () => {
        let response;
        console.log("the movie id: ", movieId);
        const session = await getSession();
        console.log('Client Session:', session);

        if (isFavourite) {
            response = await axios.delete('/api/favorite', { data: { movieId } });
        } else {
            console.log("adding to favourites");

            response = await axios.post('/api/favorite', { movieId }//, {
                //headers: {
                //    'CSRF-Token': csrfToken
                //},
                //withCredentials: true
            //}
            );
            console.log("successfully added to favourites");
        }

        const updatedFavouriteIds = response?.data?.favouriteIds;

        mutate({
            ...currentUser,
            favouriteIds: updatedFavouriteIds
        });

        mutateFavourites();
    }, [movieId, isFavourite, currentUser, mutate, mutateFavourites]);
    
   const Icon = isFavourite ? AiOutlineCheck : AiOutlinePlus;
   
    return (
        <div 
        onClick={toggleFavourites}
        className='
            cursor-pointer
            group/item
            w-6
            h-6
            lg:w-10
            lg:h-10
            border-white
            border-2
            rounded-full
            flex
            justify-center
            items-center
            transition
            hover:border-neutral-300
        '
        >
           <Icon className='text-white' size={25} /> 
        </div>
    )
}


export default FavoriteButton;