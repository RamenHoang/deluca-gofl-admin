let data = [
    { id: 1, title: "Truyen tranh" },
    { id: 2, title: "Truyen tranh conan", c_parent: 1 },
    { id: 3, title: "Truyen tranh doremon", c_parent: 1 },
    { id: 4, title: "Dai so", c_parent: 5 },
    { id: 5, title: "Sach giao trinh" },
    { id: 6, title: "Giai tich 1", c_parent: 5 },
    { id: 7, title: "Truyen tranh xuka", c_parent: 1 }
]

let data_tree = (data, parent_id = undefined, level = 0)  => {
    let result = [];

    data.map((value) => {
        if (value.c_parent === parent_id) {
            value['level'] = level;
            result = [...result, value];
            let child = data_tree(data, value.id, level + 1);
            result = [...result, ...child];
        }
    })
}

console.log(data_tree(data));


export default data_tree;