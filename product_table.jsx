'use strict';

class FilterableProductTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            stockedOnly: false,
            productSearchValue: ""
        };
    }
    
    handleStockedOnlyChange(stockedOnly) {
        this.setState({
            stockedOnly: stockedOnly
        });
    }
    
    handleProductSearchChange(productSearchValue) {
        this.setState({
            productSearchValue: productSearchValue
        });
    }
    
    render() {
        const products = this.props.products;
        
        return (
            <div>
                <SearchBar 
                    stockedOnly={this.state.stockedOnly} 
                    productSearchValue={this.state.productSearchValue}
                    onProductSearchChange={(productSearchValue) => 
                        this.handleProductSearchChange(productSearchValue)}
                    onStockedOnlyChange={(stockedOnly) => 
                        this.handleStockedOnlyChange(stockedOnly)}
                />
                <ProductTable 
                    products={products} 
                    stockedOnly={this.state.stockedOnly}
                    productSearchValue={this.state.productSearchValue}
                />
            </div>
        );
    }
};

class SearchBar extends React.Component {
    handleStockedOnlyChange(e) {
        this.props.onStockedOnlyChange(e.target.checked);
    }
    
    handleProductSearchChange(e) {
        this.props.onProductSearchChange(e.target.value);
    }
    
    render() {
        const stockedOnly = this.props.stockedOnly;
        const productSearchValue = this.props.productSearchValue;
        
        return (
            <form>
                <input 
                    type="text" 
                    id="productSearch" 
                    placeholder="Search..."
                    value={productSearchValue}
                    onChange={(e) => this.handleProductSearchChange(e)}
                />
                <p>
                    <input 
                        type="checkbox" 
                        id="stocked" 
                        checked={stockedOnly}
                        value="Stocked" 
                        onChange={(e) => this.handleStockedOnlyChange(e)}
                    />
                    Only show products in stock
                </p>
            </form>
        );
    }
};

function ProductTable(props) {
    let rows = [];
    let lastCategory = "";
    const products = props.products;
    const stockedOnly = props.stockedOnly;
    const productSearchValue= props.productSearchValue;
    const productSearchRegex = new RegExp(productSearchValue, 'i');

    products.forEach((product) => {
        if (stockedOnly && !product.stocked ) {
            return;
        }
        if (!productSearchRegex.test(product.name)) {
            return;
        }
        if (lastCategory !== product.category) {
            lastCategory = product.category;
            rows.push(
                <ProductCategoryRow 
                    category={product.category} 
                    key={product.category} 
                />
            );
        }
        rows.push(
            <ProductRow 
                product={product}
                key={product.name}
            />
        );
     });

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
};

function ProductCategoryRow(props) {
    const category = props.category;
    
    return(
        <tr>
            <th colSpan="2">
                {category}
            </th>
        </tr>
    );
};

function ProductRow(props) {
    const product = props.product;
    const className = product.stocked ? "" : "out_of_stock";
    
    return (
        <tr>
            <td className={className}>
                {product.name}
            </td>
            <td>
                {product.price}
            </td>
        </tr>
    );
};

const PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(
  <FilterableProductTable products={PRODUCTS} />,
  document.getElementById('container')
);