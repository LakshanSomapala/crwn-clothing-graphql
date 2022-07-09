import { useContext, useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import ProductCard from "../../components/product-card/product-card.component";
import Spinner from "../../components/spinner/spinner.component";

import { CategoriesContext } from "../../contexts/categories.context";

import { CategoryContainer, Title } from "./category.styles";

const GET_CATEGORY = gql`
	query ($title: String) {
		getCollectionsByTitle(title: $title) {
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

const Category = () => {
	const { category } = useParams();

	const { loading, error, data } = useQuery(GET_CATEGORY, {
		//passing value to variables
		variables: {
			title: category,
		},
	});

	useEffect(() => {
		if (data) {
			const {
				getCollectionsByTitle: { items }, //first destucture getCollectionsByTitle, from it destucture items
			} = data;

			setProducts(items);
		}
	}, [category, data]);

	// const { categoriesMap, loading } = useContext(CategoriesContext);
	const [products, setProducts] = useState([]);

	// useEffect(() => {
	// 	setProducts(categoriesMap[category]);
	// }, [category, categoriesMap]);

	return (
		<Fragment>
			{loading ? (
				<Spinner />
			) : (
				<Fragment>
					<Title>{category.toUpperCase()}</Title>
					<CategoryContainer>
						{products &&
							products.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
					</CategoryContainer>
				</Fragment>
			)}
		</Fragment>
	);
};

export default Category;
