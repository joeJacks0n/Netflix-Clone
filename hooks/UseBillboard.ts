import useSWR from "swr";

import fetcher from "@/lib/fetcher";

const useBillboard = () => {
    const { data, error, isLoading } = useSWR('/api/random', fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOneReconnect: false,
    });

    return {
        data,
        error,
        isLoading
    }
}

export default useBillboard;