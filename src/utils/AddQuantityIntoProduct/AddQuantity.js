export const addQuantityIntoProduct = (uid, setState, state) => {
        setState((prevState) => {
            const product = prevState[uid];

            if(!product){
                console.warn(`product with uid ${uid} not found`);
                return prevState
            }
            const updatedProducts = {
                ...prevState,
                product: {
                    ...product,
                    quantity:  1
                }
            };
            
            return updatedProducts;
        });
    };