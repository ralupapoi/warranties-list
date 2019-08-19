const API_URL = {
    CREATE: 'warranties/create',
    READ: 'warranties',
    UPDATE: 'warranties/update',
    DELETE: 'warranties/delete'
};
const API_METHOD = {
    CREATE: 'POST',
    READ: 'GET',
    UPDATE: 'PUT',
    DELETE: 'DELETE'
};

// if we are on demo site
// if (location.host === "localhost:3000") {
if (location.host === "ralupapoi.github.io") {
    API_URL.CREATE = 'data/create.json';
    API_URL.READ = 'data/list.json';
    API_URL.UPDATE = 'data/update.json';
    API_URL.DELETE = 'data/delete.json';

    API_METHOD.CREATE = 'GET';
    API_METHOD.UPDATE = 'GET';
    API_METHOD.DELETE = 'GET';
}

const Warranties = {
    EditID: '',

    list: [],

    // API calls
    // ========================================

    create: function(name, purchaseDate, expireDate, productId, billNumber,) {
        var body = null;
        const method = API_METHOD.CREATE;
        if (method === 'POST') {
            body = JSON.stringify({
                name,
                purchaseDate,
                expireDate,
                productId,
                billNumber,
            });
        }
        fetch(API_URL.CREATE, {
            method,
            body,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(r) {
            return r.json();
        }).then(function(status) {
            if (status.success) {
                Warranties.inlineAdd(status.id, name, purchaseDate, expireDate, productId, billNumber);
            } else {
                console.warn('not saved!', status);
            }
        })
    },

    read: function() {
        fetch(API_URL.READ).then(function (r) {
            return r.json();
        }).then(function (list) {
            Warranties.list = list;
            Warranties.display(list);
        });
    },

    update: function (id, name, purchaseDate, expireDate, productId, billNumber) {
        var body = null;
        const method = API_METHOD.UPDATE;
        if (method === 'PUT') {
            body = JSON.stringify({
                id,
                name,
                purchaseDate,
                expireDate,
                productId,
                billNumber
            });
        }
        fetch(API_URL.UPDATE, {
            method,
            body,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(r) {
            return r.json();
        }).then(function(status) {
            if (status.success) {
                Warranties.inlineEdit(id, name, purchaseDate, expireDate, productId, billNumber);
            } else {
                console.warn('not saved!', status);
            }
        })
    },

    delete: function (id) {
        let body = null;
        if (API_METHOD.DELETE === 'DELETE') {
            body = JSON.stringify({id});
        }
        fetch(API_URL.DELETE, {
            method: API_METHOD.DELETE,
            body: body,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (r) {
            return r.json();
        }).then(function (status) {
            if (status.success) {
                Warranties.inlineDelete(id);
            } else {
                console.warn('not removed!', status);
            }
        })
    },

    // DOM events
    // ========================================

    initEvents: function () {
        const tbody = document.querySelector('tbody');
        tbody.addEventListener('click', function (e) {
            const cls = e.target.className;
            if (cls === 'delete') {
                const tr = e.target.parentNode.parentNode;
                const id = tr.getAttribute('data-id') * 1;
                Warranties.delete(id);
            } else if (cls === 'edit') {
                const tr = e.target.parentNode.parentNode;
                const id = tr.getAttribute('data-id') * 1;
                Warranties.edit(id);
            }
        });

        document.getElementById('search').addEventListener('input', (e) => {
            Warranties.search(e.target.value);
        });
    },

    display: function(list) {
        const rows = list.map(item => {
            return `<tr data-id="${item.id}">
            <td>${item.name}</td>
            <td>${item.purchaseDate}</td>
            <td>${item.expireDate}</td>
            <td>${item.productId}</td>
            <td>${item.billNumber}</td>
            <td>
                <a href="#" class="delete">&#10006;</a>
                <a href="#" class="edit">&#9998;</a>
            </td>
        </tr>`;
        });
        document.querySelector('tbody').innerHTML = rows.join('');
    },

    inlineAdd: function (id, name, purchaseDate, expireDate, productId, billNumber) {
        this.list.push({
            id,
            name,
            purchaseDate,
            expireDate,
            productId,
            billNumber
        });
        this.display(this.list);
        this.resetEdit();
    },

    inlineEdit: function(id, name, purchaseDate, expireDate, productId, billNumber) {
        const item = this.list.find(item => item.id === id);
        item.name = name;
        item.purchaseDate = purchaseDate;
        item.expireDate = expireDate;
        item.productId = productId;
        item.billNumber = billNumber;
        this.display(this.list);
        this.resetEdit();
    },

    resetEdit: function() {
        this.EditID = '';
        document.querySelector('[name=name]').value = '';
        document.querySelector('[name=purchaseDate]').value = '';
        document.querySelector('[name=expireDate]').value = '';
        document.querySelector('[name=productId]').value = '';
        document.querySelector('[name=billNumber]').value = '';

    },

    edit: function (id) {
        const item = this.list.find(item => item.id === id);
        document.querySelector('[name=name]').value = item.name;
        document.querySelector('[name=purchaseDate]').value = item.purchaseDate;
        document.querySelector('[name=expireDate]').value = item.expireDate;
        document.querySelector('[name=productId]').value = item.productId;
        document.querySelector('[name=billNumber]').value = item.billNumber;
        this.EditID = id;
    },

    save: function() {
        const name = document.querySelector('[name=name]').value;
        const purchaseDate = document.querySelector('[name=purchaseDate]').value;
        const expireDate = document.querySelector('[name=expireDate]').value;
        const productId = document.querySelector('[name=productId]').value;
        const billNumber = document.querySelector('[name=billNumber]').value;

        if (this.EditID) {
            this.update(this.EditID, name, purchaseDate, expireDate, productId, billNumber);
        } else {
            this.create(name, purchaseDate, expireDate, productId, billNumber);
        }
    },

    inlineDelete: function (id) {
        this.list = this.list.filter(item => item.id !== id);
        this.display(this.list);
    },

    search: function (value) {
        value = value.toLowerCase().trim();

        const filtered = this.list.filter(function (item) {
            return item.name.toLowerCase().includes(value) ||
                item.purchaseDate.toLowerCase().includes(value) ||
                item.expireDate.toLowerCase().includes(value)||
                item.productId.toLowerCase().includes(value) ||
                item.billNumber.toLowerCase().includes(value); 
        });
        this.display(filtered);
    }
};

Warranties.read();
Warranties.initEvents();
