dream code

``` blueprint
schema Todo {
    id: Id              @primary
    title: VarChar
    completed: Bool
}

schema Owner {
    id: Id              @primary
    name: VarChar
}

relation OneToMany {
    from: Todo
    to: Owner
}

// every state HAS to HAVE a capital; every state has MANY cities
relation OneToMany_RequiredOneToOne {
    from: State
    to: City
    field: City.isCapital boolean
}

action BasicActionsFactory {
    schema: Todo
    // GET /todo
    // POST /todo
    // GET /todo/:id
    // PUT /todo/:id
    // DELETE /todo/:id
}

action BasicActionsFactory {
    schema: Owner
    // GET /owner
    // POST /owner
    // GET /owner/:id
    // PUT /owner/:id
    // DELETE /owner/:id
}
```

or in rust
``` rust


#[derive(Table)]
pub struct Todo {
    #[row(primary)]
    id: Id,
    title: VarChar,
    completed: Bool,
    #[row(created_at)]
    created_at: DateTime,
}

#[derive(Table)]
pub struct Owner {
    #[row(primary)]
    id: Id,
    name: VarChar,
}

#[derive(Relation)]
pub fn implement_relations() {
    OneToMany::<Todo, Owner>::run();
    // every state HAS to HAVE a capital; every state has MANY cities
    // OneToMany_RequiredOneToOne::<State, City>::run("isCapital");
}

// or
Relation.implement! {
    OneToMany(Todo, Owner)
    // every state HAS to HAVE a capital; every state has MANY cities
    // OneToMany_RequiredOneToOne(State, City, City.isCapital boolean)
}

Schema.validate! {
    R001: schema has circular dependency
    R002: table has no primary key
}

Actions.implement! {
    // GET /todo
    // POST /todo
    // GET /todo/:id
    // PUT /todo/:id
    // DELETE /todo/:id
    BasicActionsFactory(Todo)

    // GET /owner
    // POST /owner
    // GET /owner/:id
    // PUT /owner/:id
    // DELETE /owner/:id
    BasicActionsFactory(Owner)

    // POST /state (require capital)
    // POST /state/:id (change name)
    // POST /state/:id/capital (change capital)
    // GET /state/:id/capital
    // POST /state/:id/cities
    // OneToMany_RequiredOneToOne(State, City).actions()
}

```

what about plugin api?

```rust 
mod my_plugin {

  pub fn plugin_internal_function<Dependencies>(trait_object: &mut Dependencies)
  where
  Dependencies: RelationPlugin,
  {
    // trait_object
  }
}
```

```rust (in derive macro package)
#[proc_macro_derive(MyPlugin)]
pub fn hello_macro_derive<S, I>(input: S) -> S where
    S: TokenStreamThatBelongsToTableStruct,
    I: TokenStreamThatDerivesYourPluginMainTrait
{
    let ast: TableType = special_parser::parse(input).unwrap();

    let name = ast.table_name;
    let rows = ast.rows

    // if you set RestAPI plugin as dependency you may get
    let rest_api = ast.into::<RestApiPlugin>();
    let all_endpoints = rest_api.endpoints;

    let gen = quote! {
        impl MyPlugin for #name {
            fn this_function_may_be_used_somewhere() {
                println!("Hello, Macro! My name is {}!", stringify!(#name));
            }
        }
    };
    gen.into()
}

```