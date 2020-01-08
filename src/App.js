import React from 'react';
import Header from './Header.js';
import Content from './Content.js';
import FilterBar from './FilterBar.js';
import ShoppingCard from './ShoppingCard.js';
import ShopForm from './ShopForm.js';

export default class App extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			activeShopForm: false,
			activeFilterBar: false,
			priceRange: [0, Infinity],
			activeCategoryId: '0',
			shoppingCard: []
		}
	}

	setPriceRange = () => {
		const d = document;
		const min = parseInt(d.getElementById('minFilter').value) || 0;
		const max = parseInt(d.getElementById('maxFilter').value) || Infinity;
		this.setState({
			priceRange: [ min, max ]
		})
	}

	toggleFilterBar = () => {
		this.setState({
			activeFilterBar: !this.state.activeFilterBar,
		})
	}

	changeActiveCategoryId = e => {
		this.setState({
			activeCategoryId: e.currentTarget.selectedOptions[0].id
		})
	}

	getClickedProduct = e => {
		return {
			name: e.currentTarget.dataset.name,
			price: e.currentTarget.dataset.price,
			src: e.currentTarget.dataset.src,
			count: 1
		}
	}

	getIndexOfProduct = product => {
		const {shoppingCard} = this.state;

		const findProduct = (p) => {
			return (p.name === product.name) && (p.src === product.src);
		}

		return shoppingCard.findIndex(findProduct);
	}

	handleButtonClick = e => {
		const clicked = this.getClickedProduct(e);
		const index = this.getIndexOfProduct(clicked);

		if (index !== -1) {
			this.increaseCount(index)
		} else {
			this.addItemToCard(clicked)
		}
	}

	addItemToCard = clicked => {
		this.setState({
			shoppingCard: this.state.shoppingCard.concat(clicked)
		})
	}

	increaseCount = index => {
		this.setState(
			state => {
				state.shoppingCard.forEach((p,i) => { if (i === index) { p.count++ } else return })

				return {
					shoppingCard: state.shoppingCard
				}
			}
		)
	}

	handleRemoveClick = e => {
		const clicked = this.getClickedProduct(e);
		const index = this.getIndexOfProduct(clicked);
		const count = this.state.shoppingCard[index].count;

		if (count < 2) {
			this.removeItemFromCard(clicked)
		} else {
			this.decreaseCount(index)
		}
	}

	decreaseCount = index => {
		this.setState(
			state => {
				state.shoppingCard.forEach((p,i) => {if (i === index) { p.count-- } else return })

				return {
					shoppingCard: state.shoppingCard
				}
			}
		)
	}

	removeItemFromCard = clicked => {
		this.setState({
			shoppingCard: this.state.shoppingCard.filter((p) => p.name !== clicked.name || p.src !== clicked.src),
			activeShopForm: this.state.shoppingCard === [] ? this.state.activeShopForm : false
		})
	}

	emptyShoppingCard = () => {
		this.setState({
			shoppingCard: [],
			activeShopForm: false
		})
	}

	toggleForm = () => {
		this.setState({
			activeShopForm: !this.state.activeShopForm
		})
	}

	clearAllFilters = () => {
		this.setState({
			priceRange: [],
			activeCategoryId: '0',
		})
	}

	render() {
		const {products, categories} = this.props;
		const {activeCategoryId:id, shoppingCard:card, activeShopForm:form, activeFilterBar:filter, priceRange:range} = this.state;
		const {
			changeActiveCategoryId,
			handleRemoveClick,
			handleButtonClick,
			emptyShoppingCard,
			toggleForm,
			toggleFilterBar,
			setPriceRange
		} = this;

		return (
		    <>
			  < Header
			  		onChange={toggleFilterBar}
			  	/>
			  < FilterBar
			  		activeFilterBar={filter}
					onChange={changeActiveCategoryId}
					setPriceRange={setPriceRange}
					categories={categories}
				/>
			  < ShoppingCard
			  		emptyShoppingCard={emptyShoppingCard}
					shoppingCard={card}
					onClick={handleRemoveClick}
					openForm={toggleForm}

				/>
			  < ShopForm
			  		shoppingCard={card}
					activeShopForm={form}
					closeForm={toggleForm}
			  />
			  < Content
			  		card={card}
					priceRange={range}
			  		onClick={handleButtonClick}
					activeCategoryId={id}
					categories={categories}
					products={products}
				/>
		    </>
		)
  	}
}
