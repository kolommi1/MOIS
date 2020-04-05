import React from 'react';

class Categories extends React.Component {

    categories;

    constructor(props) {
        super(props);
        this.state = {
            checkedItems: new Map(),
        };

        this.handleChange = this.handleChange.bind(this);

        this.categories = [
            {name: 'check-box-cat-1', key: 'checkBoxCat1', label: 'Jídlo', categoryId: '1'},
            {name: 'check-box-cat-2', key: 'checkBoxCat2', label: 'Oblečení', categoryId: '2'},
            {name: 'check-box-cat-3', key: 'checkBoxCat3', label: 'Cestování', categoryId: '3'},
            {name: 'check-box-cat-4', key: 'checkBoxCat4', label: 'Hygiena', categoryId: '4'},
            {name: 'check-box-cat-5', key: 'checkBoxCat5', label: 'Bydlení', categoryId: '5'},
        ];
    }

    handleChange(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState(prevState => ({checkedItems: prevState.checkedItems.set(item, isChecked)}),
            () => {
                let categoriesText = "";
                for (let i = 0; i < this.categories.length; i++){
                    // item with this name is checked
                    if(this.state.checkedItems.get(this.categories[i].name)){
                        categoriesText += this.categories[i].categoryId;
                    }
                }
                this.props.onCheckedCategoryChanged(categoriesText);
        });
    }

    render() {
        return (
            <div className="categories">
            <React.Fragment>
                {
                    this.categories.map(item => (
                        <label key={item.key} className="category-checkbox-button">
                            <input type="checkbox" name={item.name} checked={this.state.checkedItems.get(item.name)}
                                onChange={this.handleChange} hidden/><span>{item.label}</span>
                        </label>
                    ))

                }
            </React.Fragment>
           </div>
        );
    }
}

export default Categories;