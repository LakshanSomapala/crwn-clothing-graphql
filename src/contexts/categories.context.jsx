import { createContext, useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

import { getCategoriesAndDocuments } from "../utils/firebase/firebase.utils";

export const CategoriesContext = createContext({
	categoriesMap: {},
});

const COLLECTIONS = gql`
	query {
		collections {
			id
			title
			items {
				id
				name
				price
				imageUrl
			}
		}
	}
`;

export const CategoriesProvider = ({ children }) => {
	const { loading, error, data } = useQuery(COLLECTIONS); // passing query, loading is whether loading or data alrady here
	const [categoriesMap, setCategoriesMap] = useState({});

	useEffect(() => {
		if (data) {
			const { collections } = data;
			const collectionsMap = collections.reduce((acc, collection) => {
				const { title, items } = collection;
				acc[title.toLowerCase()] = items;
				return acc;
			}, {});
			setCategoriesMap(collectionsMap);
		}
	}, [data]); //only run this when data updates

	// useEffect(() => {
	//   const getCategoriesMap = async () => {
	//     const categoryMap = await getCategoriesAndDocuments();
	//     setCategoriesMap(categoryMap);
	//   };

	//   getCategoriesMap();
	// }, []);

	const value = { categoriesMap, loading };
	return (
		<CategoriesContext.Provider value={value}>
			{children}
		</CategoriesContext.Provider>
	);
};
