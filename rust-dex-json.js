rust_dex_json = {
    "borrow": {
        "introductory": "I handle borrowed data.",
        "traits": {
            "Borrow": {
                "implementor": [
                    "I have a borrowed version of myself that behaves the same way as me when hashed, compared, and ordered."
                ],
                "trait": [
                    "I can't be derived.",
                    "I was created to allow using keys that aren't owned variables for look ups in data structures like HashMaps. This is to avoid allocating new data on the heap just for a simple search, and instead only using a reference that's equivalent to the owned type and guarantees the same hash, this means for example, that a &str can be used when looking for a String in a HashMap.",
                    "I have a default implementation implemented for every type in Rust where the borrow() method returns the predictable normal reference to the type.",
                ],
                "examples": `
fn main() {

    // Vec<i32>
    let owned_key = vec![1, 2, 3];
    
    // &[i32], same values
    let borrowed_version: &[i32] = &[1, 2, 3];
    
    // we create a Hash whose key type is Vec<i32>
    let mut hash1: HashMap<Vec<i32>, i32> = HashMap::new();
    
    // we insert a Vec<i32> key
    hash1.insert(owned_key, 2);
    
    // we look for that Vec<i32> using a &[i32]
    // and we successfully find it
    // because Vec implements Borrow<[T]>
    println!("{}", hash1.get(borrowed_version).unwrap());

}

`,

                "trait_signature": `
pub trait Borrow<Borrowed>
where
    Borrowed: ?Sized,
{
    // Required method
    fn borrow(&self) -> &Borrowed;
}

`,
            },
            "BorrowMut": {
                "implementor": [
                    "I can be mutably borrowed.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I have a default implementation implemented for every Type in Rust where the borrow_mut() method returns returns the normal predictable &mut Type.",
                ],
                "examples": `
fn main() {

    // we define a Vec<i32>
    let mut owned_vec = vec![1, 2, 3];
    
    // and this is the default BorrowMut implementation
    let mut_borrow1: &mut Vec<i32> = owned_vec.borrow_mut();
    
    // but Vec also implements BorrowMut for [T]
    // so we can get a mutable reference to a [i32] by annotating the type
    let mut_borrow2: &mut [i32] = owned_vec.borrow_mut();
    
    // this can also be achieved by writing this
    let mut_borrow3: &mut [i32] = &mut owned_vec;
    
    // we can modify owned_vec using mut_borrow
    mut_borrow2[0] = 2;
    
    // it prints the modified Vec [2, 2, 3]
    println!("{:?}", owned_vec);

}

`,

                "trait_signature": `
pub trait BorrowMut<Borrowed>: Borrow<Borrowed>
where
    Borrowed: ?Sized,
{
    // Required method
    fn borrow_mut(&mut self) -> &mut Borrowed;
}

`,
            },
            "ToOwned": {
                "implementor": [
                    "I can create an owned version of myself.",
                    "I can create that owned version either via cloning or different logic.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented for borrowed types in Rust like str (to String) and [T] (to Vec).",
                    "I can't create or be part of a trait object because my methods include an additional Self requirement in the return and function parameters, this means we can't create the trait object because discerning the type of that Self parameter when creating the trait object is not possible.",
                    // "I can't create or be part of a trait object because I am implemented for many types (str, [T], i64, ..etc), and they each have different owned versions of themselves (String, Vec, i64, ..etc) with varying sizes (e.g. String has a size of 3 pointers, and an i64 has a size of 1 pointer), and I work in both of these cases so my return type size can not be discerned at compile time (this is a requirement to be a trait object).",
                    "I have a default implemention which just returns a cloned version of the type, and it's implemented for every type in Rust that implements Clone.",
                    "I'm a generalization of the Clone trait that works for any borrowed type.",
                ],
                "examples": `
fn main() {

    // ToOwned is implemented for str
    let string_slice = "some";
    let owned_string: String = string_slice.to_owned();
    
    // ToOwned is implemented for i64
    let some_number: i64 = 2;
    let another_number: i64 = some_number.to_owned();
    
    // this won't compile
    // we can't create a trait object with ToOwned (not Object-Safe)
    fn func(argument: &dyn ToOwned) {}

}

`,

                "trait_signature": `
pub trait ToOwned {
    type Owned: Borrow<Self>;

    // Required method
    fn to_owned(&self) -> Self::Owned;

    // Provided method
    fn clone_into(&self, ...)
}

`,
            },
        },
    },
    "clone": {
        "introductory": "I contain the trait for cloning",
        "traits": {
            "Clone": {
                "implementor": [
                    "An identical duplicate copy of me can be created using the .clone() method.",
                ],
                "trait": [
                    "I can be derived.",
                    "I can't create or be part of a trait object (not Object-Safe), because the .clone() method returns Self, and as the compiler begins implementing the Clone trait for the trait object, it won't be able to satisfy the method returning Self, because Self then is the trait objects and trait objects are a Dynamically Sized type, and function return types must be Sized/have a size known at compile time.",

                    "I can have simple cloning logic or custom cloning logic depending on implementation."
                ],
                "examples": `
fn main() {

    #[derive(Debug, Clone)]
    struct NumBox { num: i32 }
    
    let numbox1 = NumBox { num: 3 };
    let numbox2 = numbox1.clone();
    
    println!("{:?}", numbox1); 
    println!("{:?}", numbox2); // Identical copy of numbox1

}

`,

                "trait_signature": `
pub trait Clone: Sized {
    // Required method
    fn clone(&self) -> Self;

    // Provided method
    fn clone_from(&mut self, ...)
}

`,

            },
        },
    },
    "cmp": {
        "introductory": "I handle comparison and ordering traits",
        "traits": {
            "Eq": {
                "implementor": [
                    "I am capable of being compared with others of the same type using '==' and '!=' (.eq() and .ne()).",
                    "I don't have unsatisfied edge cases, equality is satisfied for every value that I can be.",
                    "I have PartialEq implemented.",
                ],
                "trait": [
                    "I can be derived.",
                    "I'm an accessory to the PartialEq trait, I communicate to the compiler that the equality implementation infact satisfies all cases (No edgecase like NaNs in floating numbers).",
                    "I must be implemented along side PartialEq, but I do not add any new methods, I mainly just guarantee that the equality satisfies all cases.",
                    "HashMaps do not accept types that implement only PartialEq and not me, because they need that guarantee (that there are no edge cases).",
                ],
                "examples": `
fn main() {

    let mut hashmap = std::collections::HashMap::new();

    #[derive(PartialEq, Hash)]
    struct NumBox1 { num: i32 }
    
    let numbox1 = NumBox1 { num: 3 };
    
    // we can't insert a type that doesn't implement Eq in a HashMap
    // Error: the trait bound Numbox:Eq is not satisfied
    hashmap.insert(numbox1, "value"); 


    #[derive(PartialEq, Eq, Hash)]
    struct NumBox2 { num: i32 }
    
    let numbox2 = NumBox2 { num: 3 };
    
    // now it works because we implemented Eq
    hashmap.insert(numbox2, "value"); 

}

`,

                "trait_signature": `
pub trait Eq: PartialEq { }

`,
            },
            "PartialEq": {
                "implementor": [
                    "I can be compared to some values of the same type as me using '==' and '!=' (.eq() and .ne()).",
                    "I have edge cases where the equality is not satisfied (If I also implement Eq then I don't have these edge cases).",
                ],
                "trait": [
                    "I can be derived.",
                    "I was created because the floating number NaN does not equal itself (this is the edge case), so I was created with a different name than Eq to communicate that I do not satisfy all cases of equality.",
                ],
                "examples": `
fn main() {

    #[derive(PartialEq)]
    struct NumBox {
        num: i32,
    }
    
    let numbox1 = NumBox { num: 3 };
    let numbox2 = NumBox { num: 3 };
    
    println!("{}", numbox1 == numbox2);   // true
    println!("{}", numbox1 != numbox2);   // false
    
    println!("{}", numbox1.eq(&numbox2)); // true
    println!("{}", numbox1.ne(&numbox2)); // false

}

`,

                "trait_signature": `
pub trait PartialEq<Rhs = Self>
where
    Rhs: ?Sized,
{
    // Required method
    fn eq(&self, other: &Rhs) -> bool;

    // Provided method
    fn ne(&self, ...)
}

`,
            },
            "Ord": {
                "implementor": [
                    "I can be compared to some values of the same type as me using '>', '>=', '<', '<=', (.gt(), .ge(), .lt(), .le()).",
                    "I don't have comparison edge cases with values of the same type, I can be compared to every single value.",
                    "I have PartialOrd implemented.",
                ],
                "trait": [
                    "I can be derived.",
                    "I'm an accessory to the PartialOrd trait, I communicate to the compiler that every value of a specific type is comparable to every other value of the same type (No edgecase like NaNs in floating numbers).",
                    "I must be implemented along side PartialOrd, but I do not add any new methods, I mainly just guarantee that the comparison is always valid.",
                    "Sorting does not work for types that implement only PartialOrd and not me, because they need that guarantee (that there are no edge cases).",
                ],
                "examples": `
fn main() {

    // we create an array of i32 numbers
    let mut array_of_i32 = vec![1, 0, 32, 2, 3];

    // we create an array of f32 numbers
    let mut array_of_f32 = vec![1.0, f32::NAN, 2.3];

    // i32 implements Ord and PartialOrd
    // this tells us that every single value in the type i32
    // is comparable to every single other value in i32
    // this means that there will be no problem sorting it
    array_of_i32.sort();
    println!("{:?}", array_of_i32); // prints [0, 1, 2, 3, 32]
    
    // f32 however Only implements PartialOrd (without Ord)
    // this tells us that there are some subset of f32 values
    // that are not comparable to other f32 values
    // this means that problems will rise up when we sort an f32 array
    // and it wont sort
    array_of_f32.sort(); // compiler error
    
    // the reason f32 does not implement Ord along with PartialOrd
    // is because the floating number NAN compromises ordering
    // to understand how NAN compromises ordering
    // look at those two outputs
    println!("{:?}", f32::NAN < 2.0); // prints false
    println!("{:?}", f32::NAN > 2.0); // also prints false

}

`,

                "trait_signature": `
pub trait Ord: Eq + PartialOrd {
    // Required method
    fn cmp(&self, other: &Self) -> Ordering;

    // Provided methods
    fn max(self, ...)
    fn min(self, ...)
    fn clamp(self, ...)
}

`,
            },
            "PartialOrd": {
                "implementor": [
                    "I can be compared to some values of the same type as me using '>', '>=', '<', '<=', (.gt(), .ge(), .lt(), .le()).",
                    "There are value the same type as me that I can not be compared to (If I also implement Ord then this limitation no longer holds, and I can be compared to every value of my same type).",
                ],
                "trait": [
                    "I can be derived.",
                    "I was created because there are types where not all possible values from that type can be compared to each other, (there are some values of type A that can not be compared to other values also of type A), so I was created with a different name than Ord to communicate that I do not satisfy all the space of values for comparison.",
                    "PartialEq has to also be implemented for me to work."
                ],
                "examples": `
fn main() {

    // we create an array of i32 numbers
    let mut array_of_i32 = vec![1, 0, 32, 2, 3];

    // we create an array of f32 numbers
    let mut array_of_f32 = vec![1.0, f32::NAN, 2.3];

    // i32 implements Ord and PartialOrd
    // this tells us that every single value in the type i32
    // is comparable to every single other value in i32
    // this means that there will be no problem sorting it
    array_of_i32.sort();
    println!("{:?}", array_of_i32); // prints [0, 1, 2, 3, 32]
    
    // f32 however Only implements PartialOrd (without Ord)
    // this tells us that there are some subset of f32 values
    // that are not comparable to other f32 values
    // this means that problems will rise up when we sort an f32 array
    // and it wont sort
    array_of_f32.sort(); // compiler error
    
    // the reason f32 does not implement Ord along with PartialOrd
    // is because the floating number NAN compromises ordering
    // to understand how NAN compromises ordering
    // look at those two outputs
    println!("{:?}", f32::NAN < 2.0); // prints false
    println!("{:?}", f32::NAN > 2.0); // also prints false


}

`,

                "trait_signature": `
pub trait PartialOrd<Rhs = Self>: PartialEq<Rhs>
where
    Rhs: ?Sized,
{
    // Required method
    fn partial_cmp(&self, other: &Rhs) -> Option<Ordering>;

    // Provided methods
    fn lt(&self, ...)
    fn le(&self, ...)
    fn gt(&self, ...)
    fn ge(&self, ...)
}

`,
            },
        },
    },
    "convert": {
        "introductory": "I handle conversion traits",
        "traits": {
            "AsMut": {
                "implementor": [
                    "I can be converted into a different type.",
                    "I return a mutable reference to the converted type.",
                    "I do not get consumed in conversion.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I'm the mutable version of the AsRef trait.",
                    "I am not related to the .as_mut() method implemented for Option and Result.",
                ],
                "examples": `
fn main() {

    // we build an example around these two phrases both being possible:
    // "situation has gone south"
    // "the direction you should go is south"

    // we create direction types for a Geography struct
    type South = bool;
    type North = bool;
    type East = bool;
    type West = bool;

    // we create a Geography struct
    // which has our South type
    struct Geography {
        south: South,
        north: North,
        west: West,
        east: East,
    }

    // we also create situation types for a Situation struct
    // and use the South type from above because
    // situations can also go south"
    type Good = bool;

    // Now we create the Situation struct
    // which has both the Good type, and the South type
    struct Situation {
        good: Good,
        south: South,
    }

    // we implement AsMut<South> for Geography
    // to make it convertable to a &mut South type
    impl AsMut<South> for Geography {
        // the as_mut method does not consume self
        // it takes &mut self
        // this is whats being referred to when AsMut is described as cheap
        fn as_mut(&mut self) -> &mut South {
            // we return a mutable reference to the inner south field in Geography
            &mut self.south
        }
    }

    // we also implement AsMut<South> for Situation
    // to make it convertable to a &mut South type
    impl AsMut<South> for Situation {
        // the as_mut method does not consume self
        // it takes &mut self
        // this is whats being referred to when AsMut is described as cheap
        fn as_mut(&mut self) -> &mut bool {
            // we return a mutable reference to the inner south field in situation
            &mut self.south
        }
    }

    // we create a function that accepts anything that
    // can be converted to a mutable south-like (a mutable reference of South)
    fn take_southable<T: AsMut<South>>(mut southable: T) {
        // now the conversion is inside this function in one place 
        let south: &mut South = southable.as_mut();
        // instead of Geography and Situation having to pass
        // Geography.south and Situation.south as arguments.
        // or in other conversion cases having to do more complex logic
        // this is a better alternative
    }

    // we create our situation and geography variables

    let situation = Situation {
        good: true,
        south: true,
    };
    let geography = Geography {
        north: false,
        west: false,
        east: false,
        south: true,
    };

    // we can now do this which is much better
    take_southable(situation);
    take_southable(geography);

    // than this
    take_southable(situation.south);
    take_southable(geography.south);


}

`,

                "trait_signature": `
pub trait AsMut<T>
where
    T: ?Sized,
{
    // Required method
    fn as_mut(&mut self) -> &mut T;
}

`,
            },
            "AsRef": {
                "implementor": [
                    "I can be converted into a different type.",
                    "I return a reference to the converted type.",
                    "I do not get consumed in conversion.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I was created to make functions that require e.g. String as an argument more convenient by changing them to instead require \"convertable to String\".",
                    "This avoids having to instead convert every type prior to calling the function.",
                    "Those functions can simply call .as_ref() on whatever convertable-to-String they received to get the String out (reference to String).",
                    "And as a result have the much better ergonomics of the conversion happening in one line inside the function.",
                    "I am not related to the .as_ref() method implemented for Option and Result.",
                ],
                "examples": `
fn main() {

    // we build an example around these two phrases both being possible:
    // "situation has gone south"
    // "the direction you should go is south"

    // we create direction types for a Geography struct
    type South = bool;
    type North = bool;
    type East = bool;
    type West = bool;

    // we create a Geography struct
    // which has our South type
    struct Geography {
        south: South,
        north: North,
        west: West,
        east: East,
    }

    // we also create situation types for a Situation struct
    // and use the South type from above because
    // situations can also go south"
    type Good = bool;

    // Now we create the Situation struct
    // which has both the Good type, and the South type
    struct Situation {
        good: Good,
        south: South,
    }

    // we implement AsRef<South> for Geography
    // to make it convertable to a &South type
    impl AsRef<South> for Geography {
        // the as_ref method does not consume self
        // it takes &self
        // this is whats being referred to when AsRef is described as cheap
        fn as_ref(&self) -> &South {
            // we return a reference to the inner south field in Geography
            &self.south
        }
    }

    // we also implement AsRef<South> for Situation
    // to make it convertable to a &South type
    impl AsRef<South> for Situation {
        // the as_ref method does not consume self
        // it takes &self
        // this is whats being referred to when AsRef is described as cheap
        fn as_ref(&self) -> &bool {
            // we return a reference to the inner south field in situation
            &self.south
        }
    }

    // we create a function that accepts anything that
    // can be converted to a south-like (a reference of South)
    fn take_southable<T: AsRef<South>>(southable: T) {
        // now the conversion is inside this function in one place 
        let south: &South = southable.as_ref();
        // instead of Geography and Situation having to pass
        // Geography.south and Situation.south as arguments.
        // or in other conversion cases having to do more complex logic
        // this is a better alternative
    }

    // we create our situation and geography variables

    let situation = Situation {
        good: true,
        south: true,
    };
    let geography = Geography {
        north: false,
        west: false,
        east: false,
        south: true,
    };

    // we can now do this which is much better
    take_southable(situation);
    take_southable(geography);

    // than this
    take_southable(situation.south);
    take_southable(geography.south);


}

`,

                "trait_signature": `
pub trait AsRef<T>
where
    T: ?Sized,
{
    // Required method
    fn as_ref(&self) -> &T;
}

`,
            },
            "From": {
                "implementor": [
                    "I can be created from a different type T (From<T>).",
                    "that type is consumed when it's converted to me."
                ],
                "trait": [
                    "I can't be derived.",
                    "I can't create or be part of a trait object (not Object-Safe), because I require the type I'm implemented for to have a Size known at compile time, and trait objects are Dynamically Sized Types, so the compiler will not be able to implement the From trait for the trait object. Additionally the .from() method returns Self, and as the compiler begins implementing the From trait for the trait object, it won't be able to satisfy the method returning Self, because Self then is the trait objects and trait objects are a Dynamically Sized type, and function return types must be Sized/have a size known at compile time.",
                    "I am the reciprocal of the Into trait.",
                    "The Into trait just uses me behind the scenes.",
                    "I must never fail."
                ],
                "examples": `
fn main() {

    // String implements From<&str>
    // so it can create itself from a &str
    let Some_String = String::from("string_slice");

    // prints the String
    println!("{}", Some_String);

}

`,

                "trait_signature": `
pub trait From<T>: Sized {
    // Required method
    fn from(value: T) -> Self;
}

`,
            },
            "Into": {
                "implementor": [
                    "I can be converted into a type T (Into<T>).",
                    "I am consumed after conversion.",
                    "I can tell what type I'm converted into without needing a generic argument / turbofish (I can tell by inferring it from type annotations in the code).",
                ],
                "trait": [
                    "I can't be derived.",
                    "I can't create or be part of a trait object (not Object-Safe), because I require the type I'm implemented for to have a Size known at compile time, and trait objects are Dynamically Sized Types, so the compiler will not be able to implement the Into trait for the trait object.",
                    "I am the reciprocal of the From trait.",
                    "I am automatically implemented for any type that implements From.",
                    "I just use the .from() method from the From trait behind the scenes.",
                    "I must never fail."
                ],
                "examples": `
fn main() {

    // we create a i32
    let num_i32: i32 = 2;

    // we convert it to a i64
    // .into() infers what type it's being converted into
    // from the type annotation ": i64"
    let num_i64: i64 = num_i32.into();

}

`,

                "trait_signature": `
pub trait Into<T>: Sized {
    // Required method
    fn into(self) -> T;
}

`,
            },
            "TryFrom": {
                "implementor": [
                    "I can be created from a T (TryFrom<T>).",
                    "that T is consumed when it's converted to me.",
                    "The operation of creating me might fail."
                ],
                "trait": [
                    "I can't be derived.",
                    "I can't create or be part of a trait object (not Object-Safe), because I require the type I'm implemented for to have a Size known at compile time, and trait objects are Dynamically Sized Types, so the compiler will not be able to implement the TryFrom trait for the trait object. Additionally the .try_from() method has Self in its return, and as the compiler begins implementing the TryFrom trait for the trait object, it won't be able to satisfy the method returning Self, because Self then is the trait objects and trait objects are a Dynamically Sized type, and function return types must be Sized/have a size known at compile time.",
                    "I am the reciprocal of the TryInto trait.",
                    "The TryInto trait just uses me behind the scenes.",
                    "I allow failure, so I return a Result."
                ],
                "examples": `
fn main() {

    use std::convert::TryFrom;

    #[derive(Debug)]
    struct GoldContainer { letter: String }

    // we implement TryFrom
    impl TryFrom<String> for GoldContainer {
        type Error = String;
        fn try_from(string_slice: String) -> Result<Self, Self::Error> {
            if string_slice.contains("gold") {
                // if our slice contains Gold 
                // return a Result of Self containing that slice
                Ok(Self {
                    letter: string_slice,
                })
            } else {
                // else we return an error
                Err("No gold".to_owned())
            }
        }
    }
    
    // we try to create a GoldContainer from our slice
    // we get a Result
    let possible_gold = GoldContainer::try_from("gold".to_owned());
    
    // we unwrap and it succeeds
    println!("{:?}", possible_gold.unwrap());

}

`,

                "trait_signature": `
pub trait TryFrom<T>: Sized {
    type Error;

    // Required method
    fn try_from(value: T) -> Result<Self, Self::Error>;
}

`,
            },
            "TryInto": {
                "implementor": [
                    "I can be converted into a type T (TryInto<T>).",
                    "I am consumed after conversion.",
                    "The conversion operation might fail.",
                    "I can tell what type I'm converted into without needing a generic argument / turbofish.",
                    "I can infer that type from type annotations."
                ],
                "trait": [
                    "I can't be derived.",
                    "I can't create or be part of a trait object (not Object-Safe), because I require the type I'm implemented for to have a Size known at compile time, and trait objects are Dynamically Sized Types, so the compiler will not be able to implement the TryInto trait for the trait object.",
                    "I am the reciprocal of the TryFrom trait.",
                    "I am automatically implemented for any type that implements From.",
                    "I just use the .try_from() method from the TryFrom trait behind the scenes.",
                    "I allow failure, so I return a Result."
                ],
                "examples": `
fn main() {

    // we don't need to implement TryInto
    // but it has to be in scope 
    use std::convert::{TryFrom, TryInto};

    #[derive(Debug)]
    struct GoldContainer {
        letter: String,
    }

    // we implement TryFrom
    // TryInto is automatically implemented for us
    // by Rust
    impl TryFrom<String> for GoldContainer {
        type Error = String;
        fn try_from(string_slice: String) -> Result<Self, Self::Error> {
            if string_slice.contains("gold") {
                // if our slice contains Gold
                // return a Result of Self containing that slice
                Ok(Self {
                    letter: string_slice,
                })
            } else {
                // else we return an error
                Err("No gold".to_owned())
            }
        }
    }

    // we try to get a GoldContainer from our slice through TryInto
    // we get a Result
    let string1 = "gold".to_owned();
    let possible_gold: Result<GoldContainer, String> = string1.try_into();

    // we unwrap and it succeeds
    println!("{:?}", possible_gold.unwrap());

}

`,

                "trait_signature": `
pub trait TryInto<T>: Sized {
    type Error;

    // Required method
    fn try_into(self) -> Result<T, Self::Error>;
}

`,
            },
        },
    },
    "string": {
        "introductory": "I deal with utf-8 strings",
        "traits": {
            "ToString": {
                "implementor": [

                    "I can be converted to a String using a .to_string() method that I provide.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am automatically implemented for any custom type if they implement the Display trait.",
                    "I can also be implemented for custom types in a custom way without the Display trait.",
                ],
                "examples": `
fn main() {

    struct NumBox { num: i32 }
    
    // implementing Display for Numbox automatically implements ToString
    // ToString will use the conversion-to-string specified here
    impl Display for NumBox {
        fn fmt(...) {
            /*
            implementation that returns formatting-related results
            but also includes code that converts numbox to String
            */
        }
    }
    
    let numbox = NumBox { num: 3 };
    
    // now numbox can be displayed
    println!("{}", numbox);
    
    // and can be converted to String
    let numbox_as_string: String = numbox.to_string();
    
    // you can create a ToString implementation without the Display trait
    // but this will conflict with any Display implementation present
    // so it's either one or the other
    impl ToString for NumBox {
        fn to_string(...) { /* implementation that returns a String */ }
    }
    
    // now numbox can be converted to a String without the Display trait
    let numbox_as_string: String = numbox.to_string();

}

`,

                "trait_signature": `
pub trait ToString {
    // Required method
    fn to_string(&self) -> String;
}

`,
            },
        },
    },
    "fmt": {
        "introductory": "I deal with String formatting",
        "traits": {
            "Display": {
                "implementor": [

                    "I can be used in print functions to substitute the \"{}\" part of the formatting.",
                    "I can be converted to a String, via the automatic ToString implementation that comes with me having the Display trait.",
                ],
                "trait": [
                    "I can't be derived.",
                    "If I am implemented for a type, Rust automatically implements ToString for that type.",
                ],
                "examples": `
fn main() {

    struct NumBox { num: i32 }
    
    // implementing Display for Numbox automatically implements ToString
    // ToString will use the conversion-to-string specified here
    impl Display for NumBox {
        fn fmt(...) {
            /*
            implementation that returns formatting-related results
            but also includes code that converts numbox to String
            */
        }
    }
    
    let numbox = NumBox { num: 3 };
    
    // now numbox can be displayed
    println!("{}", numbox);
    
    // and can be converted to a String
    let numbox_as_string: String = numbox.to_string();

}

`,

                "trait_signature": `
pub trait Display {
    // Required method
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error>;
}

`,
            },
            "Debug": {
                "implementor": [
                    "I can be used in print functions to substitute the \"{:?}\" part or \"{#?}\" for pretty-printing.",
                ],
                "trait": [
                    "I can be derived.",
                    "I am usually derived but I can also be implemented in a custom way."
                ],
                "examples": `
fn main() {

    // because Debug is derivable 
    // we don't need manually implement the trait
    #[derive(Debug)]
    struct NumBox {
        num: i32,
    }

    // we create our variable numbox
    let numbox = NumBox { num: 3 };

    // now numbox can be printed using {:?}
    println!("{:?}", numbox);
    
    // as well as using {:#?} for pretty printing
    println!("{:#?}", numbox);


}

`,

                "trait_signature": `
pub trait Debug {
    // Required method
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error>;
}

`,
            },
            "Binary": {
                "implementor": [
                    "I can be printed as binary with print functions using {:b}.",
                    "I can also be printed using {:#b} (adds 0b infront of the binary).",
                    "If I am a negative number I will be printed using two's complement representation (reverse all zeros and ones, and then add one to the beginning).",
                ],
                "trait": [
                    "I can't be derived.",
                ],
                "examples": `
fn main() {

    println!("{:b}", 2);   // binary representation: 10
    
    println!("{:#b}", 2);  // same but appends 0b: 0b10
    
    println!("{:b}", -2);  // two's complement representation
    // 11111111111111111111111111111110
    
    println!("{:#b}", -2); // same but appends 0b
    // 0b11111111111111111111111111111110

}

`,

                "trait_signature": `
pub trait Binary {
    // Required method
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error>;
}

`,
            },
            "LowerExp": {
                "implementor": [
                    "I can be printed with scientific number notation using {:e}. (1200 becomes 1.2e3)",
                ],
                "trait": [
                    "I can't be derived.",
                ],
                "examples": `
fn main() {

    println!("{:e}", 1200000000);   // outputs "1.2e9"

}

`,

                "trait_signature": `
pub trait LowerExp {
    // Required method
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error>;
}

`,
            },
            "LowerHex": {
                "implementor": [
                    "I can be printed in hexadecimal with print functions using {:x}.",
                    "I can also be printed using {:#x} (adds 0x infront of the hex representation).",
                    "If I am a negative number I will be printed using two's complement representation (equivalent to the binary version: reverse all zeros and ones, and then add one to the beginning).",
                ],
                "trait": [
                    "I can't be derived.",
                    "I'm the lower case version of the UpperExp trait.",
                ],
                "examples": `
fn main() {

    println!("{:x}", 168);  // hex representation: a8
    println!("{:#x}", 168); // same but appends 0x: 0xa8
    
    println!("{:x}", 2);   // positive number: 2
    println!("{:x}", -2);  // negative number: fffffffe

}

`,

                "trait_signature": `
pub trait LowerHex {
    // Required method
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error>;
}

`,
            },
            "Octal": {
                "implementor": [
                    "I can be printed in Octal representation with print functions using {:o}.",
                    "I can also be printed using {:#o} (adds 0o infront of the octal representation).",
                    "If I am a negative number I will be printed using two's complement representation (equivalent to the binary version: reverse all zeros and ones, and then add one to the beginning).",
                ],
                "trait": [
                    "I can't be derived.",
                ],
                "examples": `
fn main() {

    println!("{:o}", 168);  // octal representation: 250
    println!("{:#o}", 168); // same but appends 0o: 0o250
    
    println!("{:o}", 2);   // positive number: 2
    println!("{:o}", -2);  // negative number: 37777777776

}

`,

                "trait_signature": `
pub trait Octal {
    // Required method
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error>;
}

`,
            },
            "Pointer": {
                "implementor": [
                    "My memory address can be printed as a hexadecimal value with print functions using {:p}.",
                    "I can also be printed using {:#p} (this includes leading zeros in the pointer).",
                ],
                "trait": [
                    "I can't be derived.",
                    "I'm only implemented for pointer types.",
                ],
                "examples": `
fn main() {

    let number = 2;
    println!("{:p}", number);        // doesn't work, must provide an address
    println!("{:p}", &number);        // outputs pointer memory address
    println!("{:#p}", &number);       // same but with leading zeros included
    
    let string_slice = "str";
    println!("{:#p}", string_slice);  // a string slice is a pointer
    
    struct NumBox { num: i32 }
    let numbox = NumBox { num: 3 };
    println!("{:#p}", &numbox);       // pointer to a struct

}

`,

                "trait_signature": `
pub trait Pointer {
    // Required method
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error>;
}

`,
            },
            "UpperExp": {
                "implementor": [
                    "I can be printed with scientific number notation using {:E}. (1200 becomes 1.2E3)",
                ],
                "trait": [
                    "I can't be derived.",
                    "I'm the capital letter version of the LowerExp trait.",
                ],
                "examples": `
fn main() {

    println!("{:E}", 1200000000);   // outputs "1.2E9"

}

`,

                "trait_signature": `
pub trait UpperExp {
    // Required method
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error>;
}

`,
            },
            "UpperHex": {
                "implementor": [
                    "I can be printed in hexadecimal with print functions using {:X}.",
                    "I can also be printed using {:#X} (adds 0x infront of the hex representation).",
                    "If I am a negative number I will be printed using two's complement representation (equivalent to the binary version: reverse all zeros and ones, and then add one to the beginning).",
                ],
                "trait": [
                    "I can't be derived.",
                    "I'm the capital letter version of the LowerHex trait.",
                ],
                "examples": `
fn main() {

    println!("{:X}", 168);  // hex representation: A8
    println!("{:#X}", 168); // same but appends 0x: 0xA8
    
    println!("{:X}", 2);   // positive number: 2
    println!("{:X}", -2);  // negative number: FFFFFFFE

}

`,

                "trait_signature": `
pub trait UpperHex {
    // Required method
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error>;
}

`,
            },
            "Write": {
                "implementor": [
                    "I can accept UTF-8 data to be written into me.",
                    "I can accept that data via a &str (string slice) using .write_str()",
                    "I can accept that data via a char using .write_char()",
                    "I can accept that data via a formatted string using .write_fmt()",
                ],
                "trait": [
                    "I can't be derived.",
                    "I'm simply a constrained version of std::io::Write that only writes UTF-8.",
                    "I also don't have the capability of flushing the buffer I'm writing into like std::io::Write.",
                ],
                "examples": `
fn main() {

    // Strings implement this trait
    // so they can accpet UTF-8 data written into them
    let mut string = String::new(); 
    
    string.write_str("s").unwrap(); // written into via a string slice   
    
    string.write_char('s').unwrap(); // written into via a char
    
    string.write_fmt(format_args!("{}", 22)).unwrap(); // via a formatted string 

}

`,

                "trait_signature": `
pub trait Write {
    // Required method
    fn write_str(&mut self, s: &str) -> Result<(), Error>;

    // Provided methods
    write_char(&mut self, ...)
    write_fmt(&mut self, ...)
}

`,
            },
        },
    },
    "io": {
        "introductory": "I deal with input/output",
        "traits": {
            "IsTerminal": {
                "implementor": [
                    "I can be interrogated to whether I am a terminal or not by using the .is_terminal() method.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for IO types."
                ],
                "examples": `
fn main() {

    // these return linux std handles
    let stdin = io::stdin();
    let stdout = io::stdout();
    let stderr = io::stderr();
    
    let _: bool = stdin.is_terminal(); // returns a boolean
    let _: bool = stdout.is_terminal(); // returns a boolean
    let _: bool = stderr.is_terminal(); // returns a boolean

}

`,

                "trait_signature": `
pub trait IsTerminal: Sealed {
    // Required method
    fn is_terminal(&self) -> bool;
}

`,
            },
            "Read": {
                "implementor": [
                    "I'm a Rust representation of an outside data source of some form (e.g. stdin, a file) that can be read.",
                    "I take a buffer as an argument, and have my data read through that buffer, by outputting bytes into it.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for \"inwards travelling\"/\"input\" IO and Network types (e.g. stdin).",
                    "I do not provide an internal buffer like the BufRead trait, I have to be provided one.",
                    "I'm a purer version of io::BufRead that does not use an internal buffer to handle different situations for me.",
                ],
                "examples": `
fn main() {

    // this gives us the stdin handle which implements Read
    let stdin_ = std::io::stdin();
    let mut stdin = stdin_.lock();

    // we create our buffer
    let mut buffer: [u8; 10] = [0; 10];

    // this fills our buffer with whatever input stdin receives
    // and loads that data into our buffer
    stdin.read(&mut buffer).unwrap();

    // prints what we got in the buffer
    println!("{buffer:?}");


}

`,

                "trait_signature": `
pub trait Read {
    // Required method
    fn read(&mut self, buf: &mut [u8]) -> Result<usize>;

    // Provided methods
    fn read_vectored(&mut self, ...)
    fn is_read_vectored(&self)
    fn read_to_end(&mut self, ...)
    fn read_to_string(&mut self, ...)
    fn read_exact(&mut self, ...)
    fn read_buf(&mut self, ...)
    fn read_buf_exact(&mut self, ...)
    fn by_ref(&mut self) 
    fn bytes(self)
    fn chain(self, ...)
    fn take(self, ...)
}

`,
            },
            "BufRead": {
                "implementor": [
                    "I'm a Rust representation of an outside data source of some form (e.g. stdin, a file) that can be read.",
                    "I have an internal buffer where I can receive bytes from that outside source using the .fill_buf() method.",
                    "The .fill_buf() method fills its internal buffer with data from that source, and then reads the data from the buffer and returns it as bytes slice.",
                    "I do not automatically empty the buffer once it's read, I must explicitly call the .consume() method to empty it.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for \"inwards travelling\"/\"input\" IO and Network types (e.g. stdin).",
                    "I'm a more useful version of io::Read that utilizes an internal buffer to handle different situations more efficiently.",
                ],
                "examples": `
fn main() {

    // this gives us the stdin handle which implements BufRead
    let stdin_ = std::io::stdin();
    let mut stdin = stdin_.lock();
    
    // this fills the internal buffer with whatever input stdin receives
    // and loads that data into our data variable
    let data = stdin.fill_buf().unwrap();
    
    // prints the data
    println!("{data:?}");
    
    // because the internal buffer wasn't emptied (wasn't consumed) 
    // our data variable is again filled with the same earlier input
    // this is because we didn't explicitly empty the internal buffer
    // (the stdin will remain blocked from further input
    // until we empty the internal buffer)
    let data = stdin.fill_buf().unwrap();
    
    // prints the same previous input 
    // because .consume() was not called to empty the internal buffer 
    println!("{data:?}");
    
    // now we call .consume() to consume the internal buffer (emptying it)
    let length = data.len();
    stdin.consume(length);
    
    // now the internal buffer is empty 
    // so .fill_buf() will wait for new input to fill the internal buffer
    let data = stdin.fill_buf().unwrap();
    
    // and once it's filled this print will then run
    // prints the new user input
    println!("{data:?}");

}

`,

                "trait_signature": `
pub trait BufRead: Read {
    // Required methods
    fn fill_buf(&mut self) -> Result<&[u8]>;
    fn consume(&mut self, amt: usize);

    // Provided methods
    fn has_data_left(&mut self)
    fn read_until(&mut self, ...)
    fn skip_until(&mut self, ...)
    fn read_line(&mut self, ...)
    fn split(self, ...)
    fn lines(self)
}

`,
            },
            "Seek": {
                "implementor": [
                    "I can decide the specific starting point/location of the byte where I'm reading or writing, via a cursor that I provide using the .seek() method.",
                    "I can specify a displacement count from the beginning or end of the bytes stream where I can move the Read and Write cursor.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for general    IO and Network types.",
                ],
                "examples": `
fn main() {

    let mut file = File::open("readme.txt").unwrap();
    
    // this moves the read and write cursor 42 bytes forward
    // .seek() uses an Enum (SeekFrom) provided by the io module
    file.seek(SeekFrom::Start(42)).unwrap();
    
    // now reading and writing will read and write beginning from the 42nd byte 
    
    // ...read and write code

}

`,

                "trait_signature": `
pub trait Seek {
    // Required method
    fn seek(&mut self, pos: SeekFrom) -> Result<u64>;

    // Provided methods
    fn rewind(&mut self)
    fn stream_len(&mut self)
    fn stream_position(&mut self)
    fn seek_relative(&mut self, ...)
}

`,
            },
            "Write": {
                "implementor": [
                    "I'm a Rust representation of an outside data sink of some form (e.g. stdout, TcpStream).",
                    "I can accept any bytes to be written into me using the .write() method.",
                    "I have a buffer that stores all that is written into me.",
                    "I can flush that buffer to have it's contents immediately leave for that outside data sink using the .flush() method.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for \"outwards travelling\" IO and Network types (e.g. stdout, not stdin).",
                    "I'm a general version of std::fmt::Write that writes any byte, and is not constrained to UTF-8 data.",
                    "Rust decides on its own (based on the size of the data) when to output the data that was written to the .write() method. The purpose of .flush() is to not rely on that and to instead immediately flush the data on the line where flush is written.",
                ],
                "examples": `
fn main() {

    use std::io::Write;
    
    // this gets us the stdout handle, which implements Write by default
    let mut stdout = io::stdout();
    
    // the write function writes and then returns a result of the number of bytes written
    let _ = stdout.write("some ".as_bytes());
    
    // sleeping for 2 seconds to show that the data 
    // is not necessarilly immediately outputted to stdout
    sleep(Duration::from_millis(2000));
    
    // flushing the data, this immediately sends it to stdout
    stdout.flush().unwrap();
    
    // again, writing immediately after flushing above 
    // doesnt necessarilly write immediately to stdout
    let _ = stdout.write(" bytes".as_bytes());
    
    // sleeping for two seconds, and " bytes" was still not outputted after "some"
    sleep(Duration::from_millis(2000));
    
    // " bytes" flushed by force
    stdout.flush().unwrap();

}

`,

                "trait_signature": `
pub trait Write {
    // Required methods
    fn write(&mut self, buf: &[u8]) -> Result<usize>;
    fn flush(&mut self) -> Result<()>;

    // Provided methods
    fn write_vectored(&mut self, ...)
    fn is_write_vectored(&self)
    fn write_all(&mut self, ...)
    fn write_all_vectored(&mut self, ...)
    fn write_fmt(&mut self, ...)
    fn by_ref(&mut self)
}

`,
            },
        },
    },
    "iter": {
        "introductory": "I handle iteration traits",
        "traits": {
            DoubleEndedIterator:
            {
                "implementor": [
                    "I'm an Iterator that can be iterated over normally as well as from the end and going back.",
                    "I have a next_back() method that allows me to do that.",
                    "Like the iterator trait and by convention, The iteration is done when I return the first None from either side (For loops for example, will stop iterating over me after the first None), but the DoubleEndedIterator trait itself does not enforce that, as there are some iteration applications that directly utilize the capability of outputting alternating None and Some outputs.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for most Iterator types.",
                ],
                "examples": `
fn main() {

    // we create an iterator from a vector
    // vector iterators implement DoubleEndedIterator
    let mut vector_iterator = vec![1, 2, 3, 4].into_iter();

    println!("{:?}", vector_iterator.next().unwrap()); // prints 1
    println!("{:?}", vector_iterator.next_back().unwrap()); // prints 4
    println!("{:?}", vector_iterator.next().unwrap()); // prints 2
    println!("{:?}", vector_iterator.next_back().unwrap()); // prints 3


}

`,

                "trait_signature": `
pub trait DoubleEndedIterator: Iterator {
    // Required method
    fn next_back(&mut self) -> Option<Self::Item>;

    // Provided methods
    fn advance_back_by(&mut self, ...) 
    fn nth_back(&mut self, ...) 
    fn try_rfold(&mut self, ...)
    fn rfold(self, ...)
    fn rfind(&mut self, ...) 
}

`,
            },
            ExactSizeIterator:
            {
                "implementor": [
                    "I'm an Iterator that knows its size.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for most Iterator types.",
                ],
                "examples": `
fn main() {

    // we create two iterators
    let mut map = vec![1, 2, 3].into_iter().map(|item| item);
    let mut scan = vec![1, 2, 3].into_iter().scan(0, |_, item| Some(item));

    // map implements ExactSizedIterator
    // so we can see its length
    println!("{:?}", map.len()); // prints 3
    
    // scan does not implements ExactSizedIterator
    // so the following does not work
    println!("{:?}", scan.len()); // compile error


}

`,

                "trait_signature": `
pub trait ExactSizeIterator: Iterator {
    // Provided methods
    fn len(&self)
    fn is_empty(&self)
}

`,
            },
            Extend:
            {
                "implementor": [
                    "My inner contents can be extended using any type that's iterable (I don't have to be an iterator).",
                ],
                "trait": [
                    "I can't be derived.",
                    "I can't create or be part of a trait object (not Object-Safe), because the extend() function is generic and trait object vtables do not handle monomorphization.",
                    "I am implemented for most std collection types and container types like String and Vec",
                ],
                "examples": `
fn main() {

    // we create our new type
    #[derive(Debug)]
    struct List(Vec<i32>);

    // we implement the Extend trait for our type
    impl std::iter::Extend<i32> for List {
        // we implement the extend method
        // it takes any type that can be turned into an iterator
        // meaning any type that implements the IntoIterator trait
        // and then extends our List with the contents of that type
        fn extend<T: IntoIterator<Item = i32>>(&mut self, iter: T) {
            // we use the extend method for Vecs to extend the List
            // because our List is just a thin wrapper
            self.0.extend(iter);
        }
    }

    // we now create an initial list
    let mut list = List(vec![0, 1]);

    // we extend it using a range
    // (ranges implement Into Iterator)
    // so this works
    list.extend(2..4);

    // we extend it again using a vec
    // (Vecs implement Into Iterator)
    // so this works
    list.extend(vec![4, 5]);

    // list is now extended
    println!("{:?}", list); // prints List([0, 1, 2, 3, 4, 5])


}

`,

                "trait_signature": `
pub trait Extend<A> {
    // Required method
    fn extend<T>(&mut self, iter: T)
       where T: IntoIterator<Item = A>;

    // Provided methods
    fn extend_one(&mut self, ...) 
    fn extend_reserve(&mut self, ...) 
}

`,
            },
            FusedIterator:
            {
                "implementor": [
                    "I'm an iterator that indefinitely returns None after the first None that I return.",
                    "I continue to to return None even if some Some values exist after the first None.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for almost all Iterator types.",
                ],
                "examples": `
fn main() {

    // we create an iterator 
    // by using an increasing range from 0 to 9 
    // and returning Some everywhere 
    // except for when the value is 4
    // meaning we will have continuos Some values
    // and one None in the middle
    let mut iterator = (0..10).scan(0, |_, item| {
        if item == 4 {
            return None;
        } else {
            return Some(item);
        }
    });

    // We fuse the iterator
    let mut iterator_fused = iterator.fuse();
    
    // Now we continue to call next()
    println!("{:?}", iterator_fused.next()); // returns Some(0)
    println!("{:?}", iterator_fused.next()); // Some(1)
    println!("{:?}", iterator_fused.next()); // Some(2)
    println!("{:?}", iterator_fused.next()); // Some(3)
    println!("{:?}", iterator_fused.next()); // None 
    println!("{:?}", iterator_fused.next()); // None despite having Some values left
    println!("{:?}", iterator_fused.next()); // None despite having Some values left
    println!("{:?}", iterator_fused.next()); // None despite having Some values left


}

`,

                "trait_signature": `
pub trait FusedIterator: Iterator { }

`,
            },
            Iterator:
            {
                "implementor": [
                    "I can be iterated over.",
                    "I have a next() function that allows iteration over me.",
                    "I specify an internal item which is the main value to be iterated over.",
                    "I am lazily evaluated, meaning I don't actually get iterated over unless the next() function is called.",
                    "By convention, The iteration is done when I return the first None (For loops for example, will stop iterating over me after the first None), but the Iterator trait itself does not enforce such a rule as there are some iteration applications that directly utilize the capability of outputting alternating None and Some outputs.",
                ],
                "trait": [
                    "I can't be derived.",
                ],
                "examples": `
fn main() {

    let values = vec![1, 2, 3];

    // this doesn't do anything (iterators are lazy)
    values.iter().map(|value| value + 1);
    
    // Now it's evaluated (the collect function forces the iteration)
    let b = values.iter().map(|value| value + 1).collect::<Vec<i32>>();

}

`,

                "trait_signature": `
pub trait Iterator {
    type Item;

    // Required method
    fn next(&mut self) -> Option<Self::Item>;

    // Provided methods
    fn next_chunk(&mut self)
    fn size_hint(&self)
    fn count(self)
    fn last(self)
    fn advance_by(&mut self, ...)
    fn nth(&mut self, ...)
    fn step_by(self, ...)
    fn chain(self, ...)
    fn zip(self, ...)
    fn intersperse(self, ...)
    fn intersperse_with(self, ...)
    fn map(self, ...)
    fn for_each(self, ...)
    fn filter(self, ...) 
    fn filter_map(self, ...) 
    fn enumerate(self) 
    fn peekable(self) 
    fn skip_while(self, ...) 
    fn take_while(self, ...) 
    fn map_while(self, ...) 
    fn skip(self, ...) 
    fn take(self, ...) 
    fn scan(self, ...)
    fn flat_map(self, ...) 
    fn flatten(self) 
    fn map_windows(self, ...)
    fn fuse(self) 
    fn inspect(self, ...) 
    fn by_ref(&mut self) 
    fn collect(self) 
    fn try_collect(&mut self)
    fn collect_into(self, ...) 
    fn partition(self, ...) 
    fn partition_in_place(self, ...) 
    fn is_partitioned(self, ...) 
    fn try_fold(&mut self, ...)
    fn try_for_each(&mut self, ...) 
    fn fold(self, ...) 
    fn reduce(self, ...) 
    fn try_reduce(&mut self, ...)
    fn all(&mut self, ...) 
    fn any(&mut self, ...)
    fn find(&mut self, ...) 
    fn find_map(&mut self, ...) 
    fn try_find(&mut self, ...)
    fn position(&mut self, ...) 
    fn rposition(&mut self, ...) 
    fn max(self) 
    fn min(self) 
    fn max_by_key(self, ...) 
    fn max_by(self, ...) 
    fn min_by_key(self, ...) 
    fn min_by(self, ...) 
    fn rev(self) 
    fn unzip(self) 
    fn copied(self) 
    fn cloned(self) 
    fn cycle(self) 
    fn array_chunks(self) 
    fn sum(self) 
    fn product(self)
    fn cmp(self, ...) 
    fn cmp_by(self, ...) 
    fn partial_cmp(self, ...)
    fn partial_cmp_by(self, ...)
    fn eq(self, ...)
    fn eq_by(self, ...)
    fn ne(self, ...)
    fn lt(self, ...)
    fn le(self, ...)
    fn gt(self, ...)
    fn ge(self, ...)
    fn is_sorted(self)
    fn is_sorted_by(self, ...)
    fn is_sorted_by_key(self, ...)
}

`,
            },
            Product:
            {
                "implementor": [
                    "I'm the internal item inside an iterator, and I can be multiplied with each of the other entries inside the iterator into one result.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I can't create or be part of a trait object (not Object-Safe), because the product() function is not a method (does not take self as an argument), and because of that, can not be distinguished nor be accessed at runtime by the trait object, I also require that the types I'm implemented for must be Sized/have a size known at compile time, and therefore I cant be made into a trait object, because trait objects are not sized (Dynamically Sized Type) and they have to implement the trait, and even if those rules weren't broken, the .sum() function returns Self, which also breaks Object Safety rules.",
                    "I am implemented for all numeric primitives like i32, f64, ..etc and therefore all iterators whose internal types are these types can call sum().",
                ],
                "examples": `
fn main() {

    // we create our new type
    #[derive(Debug)]
    struct num(i32);

    // we implement Product for our type
    impl std::iter::Product for num {
        // we implement the product function
        fn product<I>(iter: I) -> Self
        where
            I: Iterator<Item = Self>,
        {
            // we multiply all of the nums
            // that are in the iterator
            // into one num
            iter.into_iter()
                .fold(num(1), |acc, item| num(acc.0 * item.0))
        }
    }

    // we create an iterator that has num as an internal type
    let vector = vec![num(10), num(10), num(10)].into_iter();

    // we call the product function
    println!("{:?}", vector.product::<num>()); // prints num(1000)


}

`,

                "trait_signature": `
pub trait Product<A = Self>: Sized {
    // Required method
    fn product<I>(iter: I) -> Self
       where I: Iterator<Item = A>;
}

`,
            },
            Sum:
            {
                "implementor": [
                    "I'm the internal item inside an iterator, and I can be summed along with the other entries inside the iterator into one result.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I can't create or be part of a trait object (not Object-Safe), because the sum() function is not a method (does not take self as an argument), and because of that, can not be distinguished and also can not be accessed at runtime by the trait object, I also require that the types I'm implemented for must be Sized/have a size known at compile time, and therefore I cant be made into a trait object, because trait objects are not sized (Dynamically Sized Type) and they have to implement the trait, and even if those rules weren't broken, the .sum() function returns Self, which also breaks Object Safety rules.",
                    "I am implemented for all numeric primitives like i32, f64, ..etc and therefore all iterators whose internal types are these types can call sum().",
                ],
                "examples": `
fn main() {

    // we create our new type
    #[derive(Debug)]
    struct num(i32);

    // we implement Sum for our type
    impl std::iter::Sum for num {
        // we implement the sum function
        fn sum<I>(iter: I) -> Self
        where
            I: Iterator<Item = Self>,
        {
            // we sum all of the nums 
            // that are in the iterator 
            // into one num
            iter.into_iter()
                .fold(num(0), |acc, item| num(acc.0 + item.0))
        }
    }

    // we create an iterator that has num as an internal type
    let vector = vec![num(10), num(10), num(10)].into_iter();

    // we call the sum function 
    println!("{:?}", vector.sum::<num>()); // prints num(30)

}

`,

                "trait_signature": `
pub trait Sum<A = Self>: Sized {
    // Required method
    fn sum<I>(iter: I) -> Self
       where I: Iterator<Item = A>;
}

`,
            },
            FromIterator:
            {
                "implementor": [
                    "I can create myself from an Iterator.",
                    "the collect function can collect into me using a turbofish."
                ],
                "trait": [
                    "I can't be derived.",
                    "I can't create or be part of a trait object (not Object-Safe), because I require the type I'm implemented for to have a Size known at compile time, and trait objects are Dynamically Sized Types, so the compiler will not be able to implement the FromIterator trait for the trait object. Additionally the .from_iter() method returns Self, and as the compiler begins implementing the FromIterator trait for the trait object, it won't be able to satisfy the method returning Self, because Self then is the trait objects and trait objects are a Dynamically Sized type, and function return types must be Sized/have a size known at compile time.",
                    "the collect function can collect into me using a turbofish",
                ],
                "examples": `
fn main() {

    // create an iterator
    let iterator = vec![(1, 0), (2, 0), (3, 0)].into_iter();

    // create a HashMap from the iterator
    let hashmap: HashMap<i32, i32> = HashMap::from_iter(iterator);

    // create a HashMap from the iterator using collect()
    let hashmap2 = vec![(1, 0), (2, 0), (3, 0)]
        .into_iter()
        .collect::<HashMap<i32, i32>>();

}

`,

                "trait_signature": `
pub trait FromIterator<A>: Sized {
    // Required method
    fn from_iter<T>(iter: T) -> Self
       where T: IntoIterator<Item = A>;
}

`,
            },

            IntoIterator:
            {
                "implementor": [
                    "I can be converted into an iterator.",
                    "I have access to an into_iter() method that does that.",
                    "for loops can iterate over me."
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented for most data structures in Rust.",
                    "I am automatically implemented for any type in Rust that implements the Iterator trait.",

                ],
                "examples": `
fn main() {

    // We create a type to implement IntoIterator for
    struct Counter {
        count: Vec<i32>,
    }

    // We implement   IntoIterator for Counter
    impl IntoIterator for Counter {
        type Item = // Implementation detail
        type IntoIter = // Implementation detail
        fn into_iter(self) -> Self::IntoIter {
            // Implementation
        }
    }
    
    // We create our counter variable
    let counter = Counter { count: vec![1, 2, 3] };
    
    // Now it can function like an iterator
    for count in counter {
        // Do something
    }


}

`,

                "trait_signature": `
pub trait IntoIterator {
    type Item;
    type IntoIter: Iterator<Item = Self::Item>;

    // Required method
    fn into_iter(self) -> Self::IntoIter;
}

`,
            },
        }
    },
    "marker": {
        "introductory": "We are \"primitive traits\", meaning we act as foundational signifiers that do not actually provide any methods, we simply give you insight about what you should expect from our implementors",
        "traits": {
            "Copy": {
                "implementor": [
                    "I don't change ownership/get \"moved\" when I am assigned from an old variable to a new variable.",
                    "Instead I get copied bit by bit behind the scenes to the new variable via memcpy, and the old variable can still be used.",
                ],
                "trait": [
                    "I can be derived.",
                    "Clone has to also be implemented for me to work."
                ],
                "examples": `
fn main() {

    #[derive(Debug, Copy, Clone)]
    struct NumBox { num: i32 }
    
    let numbox1 = NumBox { num: 3 };
    let numbox2 = numbox1;
    
    println!("{:?}", numbox1); // numbox1 still prints, it wasn't moved
    println!("{:?}", numbox2); // copy of numbox1 without needing .clone()

}

`,

                "trait_signature": `
pub trait Copy: Clone { }

`,
            },
            "Sized": {
                "implementor": [
                    "My size is known at compile time.",
                    "I can be stored in the stack, but if I am too large I will cause stack overflow.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am automatically implemented for almost every type in Rust.",
                    "The stack only stores variable that are Sized.",
                    "When you want to specify some type as explicity not sized, the ?Sized notation is used.",
                    "?Sized types can not be stored in the stack.",
                    "?Sized variables are called Dynamically Sized Types.",
                ],
                "examples": `
fn main() {

    // argument allowed, size known at compile time
    // explicitly stated array size (3)
    fn func1(array: [u8; 3]) { ... }  
    
    // argument allowed, it's not known at compile time 
    // but it's behind a reference 
    // which has a known size of usize 
    fn func2(array: &[u8]) { ... }  
    
    // will not compile, argument size not known at compile time 
    // array could be any length
    fn func3(array: [u8]) { ... }

    // this reads: (function that takes any argument that's not sized)
    // which will not compile because the size is not known
    fn func4(some_argument: impl ?Sized) { ... }

    // will compile because the size is known at compile time
    // but will error and exit immediately due to stack overflow
    // array size too large and overflows the stack
    let array = [0; 10000000];

}

`,

                "trait_signature": `
pub trait Sized { }

`,
            },
        },
    },
    "ops": {
        "introductory": "I handle operators",
        "traits": {
            "Add": {
                "implementor": [
                    "I can be added to myself using the + sign or the add() method.",
                    "I can also be added to any specific type, and not only myself, as it dependes on how Add was implemented for me.",
                    "I do not necessarily output a type similar to myself as the result of addition, as that also dependes on how Add was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the Add trait
    // and specify the type of right hand side
    // (the thing to the right of the + sign / the thing that will be added)
    // as Vector2D, meaning we implement adding it only to itself
    impl Add<Vector2D> for Vector2D {
        
        // we specify the type of the output of the addition 
        type Output = Vector2D;

        // we implement the add() method 
        fn add(self, rhs: Self) -> Self::Output {
            Vector2D(self.0 + rhs.0, self.1 + rhs.1)
        }
    }

    // we create a Vector2D
    let a = Vector2D(1, 2);

    // we can now add a Vector2D to it
    // because we implemented Add<Vector2D>
    println!("{:?}", a + Vector2D(1, 2)); // outputs Vector2D(2, 4)
    println!("{:?}", a.add(Vector2D(1, 2))); // outputs Vector2D(2, 4)

    // but this won't work
    // because we didn't implement Add<i32>
    println!("{:?}", a + 2); // compiler error
    println!("{:?}", a.add(2)); // compiler error

}

`,

                "trait_signature": `
pub trait Add<Rhs = Self> {
    type Output;

    // Required method
    fn add(self, rhs: Rhs) -> Self::Output;
}

`,
            },
            "Sub": {
                "implementor": [
                    "I can be subtracted from myself using the - sign or the sub() method.",
                    "Any other specific type can also be subtracted from me, and not only myself, as it dependes on how Sub was implemented for me.",
                    "I do not necessarily output a type similar to myself as the result of subtraction, as that also dependes on how Sub was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type\t#[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the Sub trait
    // and specify the type of right hand side
    // (the thing to the right of the - sign / the thing that will be subtracted)
    // as Vector2D, meaning we implement subtracting it only by itself
    impl Sub<Vector2D> for Vector2D {
        
        // we specify the type of the output of the subtraction 
        type Output = Vector2D;

        // we implement the sub() method 
        fn sub(self, rhs: Self) -> Self::Output {
            Vector2D(self.0 - rhs.0, self.1 - rhs.1)
        }
    }

    // we create a Vector2D
    let a = Vector2D(1, 2);

    // we can now subtract a Vector2D from it
    // because we implemented Sub<Vector2D>
    println!("{:?}", a - Vector2D(1, 2)); // outputs Vector2D(0, 0)
    println!("{:?}", a.sub(Vector2D(1, 2))); // outputs Vector2D(0, 0)

    // but this won't work
    // because we didn't implement Sub<i32>
    println!("{:?}", a - 2); // compiler error
    println!("{:?}", a.sub(2)); // compiler error


}

`,

                "trait_signature": `
pub trait Sub<Rhs = Self> {
    type Output;

    // Required method
    fn sub(self, rhs: Rhs) -> Self::Output;
}

`,
            },
            "Div": {
                "implementor": [
                    "I can be divided by myself using the / sign or the div() method.",
                    "I can also be divided by any other specific type, and not only myself, as it dependes on how Div was implemented for me.",
                    "I do not necessarily output a type similar to myself as the result of division, as that also dependes on how Div was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the Div trait
    // and specify the type of right hand side
    // (the thing to the right of the "/" sign / the thing that we will divide by)
    // as Vector2D, meaning we implement division for it only by itself
    impl Div<Vector2D> for Vector2D {
        
        // we specify the type of the output of the division
        type Output = Vector2D;

        // we implement the div() method 
        fn div(self, rhs: Self) -> Self::Output {
            Vector2D(self.0 / rhs.0, self.1 / rhs.1)
        }
    }
    // we create a Vector2D
    let a = Vector2D(1, 2);

    // we can now divide it by a Vector2D
    // because we implemented Div<Vector2D>
    println!("{:?}", a / Vector2D(1, 2)); // outputs Vector2D(1, 1)
    println!("{:?}", a.div(Vector2D(1, 2))); // outputs Vector2D(1, 1)

    // but this won't work
    // because we didn't implement Div<i32>
    println!("{:?}", a / 2); // compiler error
    println!("{:?}", a.div(2)); // compiler error


}

`,

                "trait_signature": `
pub trait Div<Rhs = Self> {
    type Output;

    // Required method
    fn div(self, rhs: Rhs) -> Self::Output;
}

`,
            },
            "Mul": {
                "implementor": [
                    "I can multiply by myself using the * sign or the mul() method.",
                    "I can also multiply by any other specific type, and not only myself, as it dependes on how Mul was implemented for me.",
                    "I do not necessarily output a type similar to myself as the result of multiplication, as that also dependes on how Mul was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the Mul trait
    // and specify the type of right hand side
    // (the thing to the right of the * sign / the thing that we will multiply by)
    // as Vector2D, meaning we implement multiplication for it only by itself
    impl Mul<Vector2D> for Vector2D {
        
        // we specify the type of the output of the multiplication
        type Output = Vector2D;

        // we implement the mul() method 
        fn mul(self, rhs: Self) -> Self::Output {
            Vector2D(self.0 * rhs.0, self.1 * rhs.1)
        }
    }
    // we create a Vector2D
    let a = Vector2D(1, 2);

    // we can now multiply it by a Vector2D
    // because we implemented Mul<Vector2D>
    println!("{:?}", a * Vector2D(1, 2)); // outputs Vector2D(1, 4)
    println!("{:?}", a.mul(Vector2D(1, 2))); // outputs Vector2D(1, 4)

    // but this won't work
    // because we didn't implement Mul<i32>
    println!("{:?}", a * 2); // compiler error
    println!("{:?}", a.mul(2)); // compiler error



}

`,

                "trait_signature": `
pub trait Mul<Rhs = Self> {
    type Output;

    // Required method
    fn mul(self, rhs: Rhs) -> Self::Output;
}

`,
            },
            "Rem": {
                "implementor": [
                    "I am capable of finding the remainder of my division with another value using the % sign or the rem() method.",
                    "I can use the remainder operator with any type, and not only myself, as it dependes on how Rem was implemented for me.",
                    "I do not necessarily output a type similar to myself as the result of the remainder operation, as that also dependes on how Rem was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the Rem trait
    // and specify the type of right hand side
    // (the thing to the right of the % sign / the thing that we will divide by)
    // as Vector2D, meaning we implement it to only divide by itself
    impl Rem<Vector2D> for Vector2D {
        
        // we specify the type of the output of the remainder operation
        type Output = Vector2D;

        // we implement the rem() method 
        fn rem(self, rhs: Self) -> Self::Output {
            Vector2D(self.0 % rhs.0, self.1 % rhs.1)
        }
    }
    // we create a Vector2D
    let a = Vector2D(1, 2);

    // we can now find the remainder with a Vector2D
    // because we implemented Rem<Vector2D>
    println!("{:?}", a % Vector2D(1, 2)); // outputs Vector2D(0, 0)
    // println!("{:?}", a.rem(Vector2D(1, 2))); // outputs Vector2D(0, 0)

    // but this won't work
    // because we didn't implement Rem<i32>
    // println!("{:?}", a % 2); // compiler error
    // println!("{:?}", a.rem(2)); // compiler error


}

`,

                "trait_signature": `
pub trait Rem<Rhs = Self> {
    type Output;

    // Required method
    fn rem(self, rhs: Rhs) -> Self::Output;
}

`,
            },
            "Shl": {
                "implementor": [
                    "I can be left shifted using the << sign or the shl() method.",
                    "I can also be left shifted using any other specific type, and not only myself, as it dependes on how Shl was implemented for me.",
                    "I do not necessarily output a type similar to myself as the result of left shifting, as that also dependes on how Shl was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the Shl trait
    // and specify the type of right hand side
    // (the thing to the right of the "<<" sign)
    // as Vector2D, meaning we can only left shift it with a value of the same type
    impl Shl<i32> for Vector2D {
        // we define the output to be Vector2D
        type Output = Vector2D;

        // we implement the shl() method which takes an owned self
        fn shl(self, rhs: i32) -> Self::Output {
            Vector2D(self.0 << rhs, self.1 << rhs)
        }
    }

    // we create our vector to left shift it
    let vector = Vector2D(1, 1);

    // now left shifting a vector works
    println!("{:?}", vector << 10); // prints Vector2D(1024, 1024)
    println!("{:?}", vector.shl(10)); // prints Vector2D(1024, 1024)


}

`,

                "trait_signature": `
pub trait Shl<Rhs = Self> {
    type Output;

    // Required method
    fn shl(self, rhs: Rhs) -> Self::Output;
}

`,
            },
            "Shr": {
                "implementor": [
                    "I can be right shifted using the >> sign or the shr() method.",
                    "I can also be right shifted using any other specific type, and not only myself, as it dependes on how Shr was implemented for me.",
                    "I do not necessarily output a type similar to myself as the result of right shifting, as that also dependes on how Shr was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the Shr trait
    // and specify the type of right hand side
    // (the thing to the right of the ">>" sign)
    // as Vector2D, meaning we can only right shift it with a value of the same type
    impl Shr<i32> for Vector2D {
        // we define the output to be Vector2D
        type Output = Vector2D;

        // we implement the shr() method which takes an owned self
        fn shr(self, rhs: i32) -> Self::Output {
            Vector2D(self.0 >> rhs, self.1 >> rhs)
        }
    }

    // we create our vector to right shift it
    let vector = Vector2D(1024, 1024);

    // now right shifting a vector works
    println!("{:?}", vector >> 10); // prints Vector2D(1, 1)
    println!("{:?}", vector.shr(10)); // prints Vector2D(1, 1)


}

`,

                "trait_signature": `
pub trait Shr<Rhs = Self> {
    type Output;

    // Required method
    fn shr(self, rhs: Rhs) -> Self::Output;
}

`,
            },
            "AddAssign": {
                "implementor": [
                    "I can be mutated to have a value added to me with one operation \"+=\" or the add_assign() method.",
                    "I can be \"addassigned\" any other type, and not only a similar type to myself, as it dependes on how AddAssign was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we implement the AddAssign trait
    // and specify the type of right hand side
    // (the thing to the right of the += sign / the thing that we will add)
    // as Vector2D, meaning we can only "addassign" it with a value of the same type
    impl AddAssign<Vector2D> for Vector2D {
        // we implement the add_assign() method
        // add_assign only mutates the original type
        // so we need a &mut self
        fn add_assign(&mut self, rhs: Vector2D) {
            self.0 += rhs.0;
            self.1 += rhs.1;
        }
    }
    // we create a mutable Vector2D
    let mut a = Vector2D(1, 2);

    // we can now "addassign" it with a Vector2D
    // because we implemented AddAssign<Vector2D>
    a += Vector2D(1, 2);
    println!("{:?}", a); // will output Vector2D(2, 4)

    a.add_assign(Vector2D(1, 2));
    println!("{:?}", a); // will also output Vector2D(2, 4)

    // but this won't work
    // because we didn't implement AddAssign<i32>
    a += 2; // compiler error
    a.add_assign(2); // compiler error


}

`,

                "trait_signature": `
pub trait AddAssign<Rhs = Self> {
    // Required method
    fn add_assign(&mut self, rhs: Rhs);
}

`,
            },
            "SubAssign": {
                "implementor": [
                    "I can be mutated to have a value subtracted from me with one operation \"-=\" or the sub_assign() method.",
                    "I can be \"subassigned\" any other type, and not only a similar type to myself, as it dependes on how SubAssign was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the SubAssign trait
    // and specify the type of right hand side
    // (the thing to the right of the -= sign / the thing that we will subtract)
    // as Vector2D, meaning we can only "subassign" it with a value of the same type
    impl SubAssign<Vector2D> for Vector2D {
        // we implement the sub_assign() method
        // sub_assign only mutates the original type
        // so we need a &mut self
        fn sub_assign(&mut self, rhs: Vector2D) {
            self.0 -= rhs.0;
            self.1 -= rhs.1;
        }
    }
    // we create a mutable Vector2D
    let mut a = Vector2D(1, 2);

    // we can now "subassign" it with a Vector2D
    // because we implemented SubAssign<Vector2D>
    a -= Vector2D(1, 2);
    println!("{:?}", a); // will output Vector2D(0, 0)

    a.sub_assign(Vector2D(1, 2));
    println!("{:?}", a); // will also output Vector2D(0, 0)

    // but this won't work
    // because we didn't implement SubAssign<i32>
    a -= 2; // compiler error
    a.sub_assign(2); // compiler error



}

`,

                "trait_signature": `
pub trait SubAssign<Rhs = Self> {
    // Required method
    fn sub_assign(&mut self, rhs: Rhs);
}

`,
            },
            "DivAssign": {
                "implementor": [
                    "I can be mutated to the result of dividing myself with a value using one operation \"//=\" or the div_assign() method.",
                    "I can be \"divassigned\" any other type, and not only a similar type to myself, as it dependes on how DivAssign was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the DivAssign trait
    // and specify the type of right hand side
    // (the thing to the right of the "/=" sign / the thing that we will divide by)
    // as Vector2D, meaning we can only "divassign" it with a value of the same type
    impl DivAssign<Vector2D> for Vector2D {
        // we implement the div_assign() method
        // div_assign only mutates the original type
        // so we need a &mut self
        fn div_assign(&mut self, rhs: Vector2D) {
            self.0 /= rhs.0;
            self.1 /= rhs.1;
        }
    }
    // we create a mutable Vector2D
    let mut a = Vector2D(1, 2);

    // we can now "divassign" it with a Vector2D
    // because we implemented DivAssign<Vector2D>
    a /= Vector2D(1, 2);
    println!("{:?}", a); // will output Vector2D(1, 1)

    a.div_assign(Vector2D(1, 2));
    println!("{:?}", a); // will also output Vector2D(1, 1)

    // but this won't work
    // because we didn't implement DivAssign<i32>
    a /= 2; // compiler error
    a.div_assign(2); // compiler error


}

`,

                "trait_signature": `
pub trait DivAssign<Rhs = Self> {
    // Required method
    fn div_assign(&mut self, rhs: Rhs);
}

`,
            },
            "MulAssign": {
                "implementor": [
                    "I can be mutated to the result of multiplying myself with a value using one operation \"*=\" or the mul_assign() method.",
                    "I can be \"mulassigned\" any other type, and not only a similar type to myself, as it dependes on how MulAssign was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the MulAssign trait
    // and specify the type of right hand side
    // (the thing to the right of the "*=" sign / the thing that we will multiply by)
    // as Vector2D, meaning we can only "mulassign" it with a value of the same type
    impl MulAssign<Vector2D> for Vector2D {
        // we implement the mul_assign() method
        // mul_assign only mutates the original type
        // so we need a &mut self
        fn mul_assign(&mut self, rhs: Vector2D) {
            self.0 *= rhs.0;
            self.1 *= rhs.1;
        }
    }
    // we create a mutable Vector2D
    let mut a = Vector2D(1, 2);

    // we can now "mulassign" it with a Vector2D
    // because we implemented MulAssign<Vector2D>
    a *= Vector2D(1, 2);
    println!("{:?}", a); // will output Vector2D(1, 4)

    a.mul_assign(Vector2D(1, 2));
    println!("{:?}", a); // will also output Vector2D(1, 4)

    // but this won't work
    // because we didn't implement MulAssign<i32>
    a *= 2; // compiler error
    a.mul_assign(2); // compiler error


}

`,

                "trait_signature": `
pub trait MulAssign<Rhs = Self> {
    // Required method
    fn mul_assign(&mut self, rhs: Rhs);
}

`,
            },
            "RemAssign": {
                "implementor": [
                    "I can be mutated to become the remainder of my division by any value using one operation \"*=\" or the rem_assign() method.",
                    "I can \"remassign\" by any other type, and not only a similar type to myself, as it dependes on how RemAssign was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the RemAssign trait
    // and specify the type of right hand side
    // (the thing to the right of the "%=" sign / the thing that we will divide by)
    // as Vector2D, meaning we can only "remassign" it with a value of the same type
    impl RemAssign<Vector2D> for Vector2D {
        // we implement the rem_assign() method
        // rem_assign only mutates the original type
        // so we need a &mut self
        fn rem_assign(&mut self, rhs: Vector2D) {
            self.0 %= rhs.0;
            self.1 %= rhs.1;
        }
    }
    // we create a mutable Vector2D
    let mut a = Vector2D(1, 2);

    // we can now "remassign" it with a Vector2D
    // because we implemented RemAssign<Vector2D>
    a %= Vector2D(1, 2);
    println!("{:?}", a); // will output Vector2D(0, 0)

    a.rem_assign(Vector2D(1, 2));
    println!("{:?}", a); // will also output Vector2D(0, 0)

    // but this won't work
    // because we didn't implement RemAssign<i32>
    a %= 2; // compiler error
    a.rem_assign(2); // compiler error


}

`,

                "trait_signature": `
pub trait RemAssign<Rhs = Self> {
    // Required method
    fn rem_assign(&mut self, rhs: Rhs);
}

`,
            },
            "ShlAssign": {
                "implementor": [
                    "I can be mutated to become the result of my left shifting by any value using one operation \"<<=\" or the shl_assign() method.",
                    "I can be \"shlassigned\" by any other type, and not only a similar type to myself, as it dependes on how ShlAssign was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the ShlAssign trait
    // and specify the type of right hand side
    // (the thing to the right of the "<<=" sign)
    // as i32, meaning we can only shift-left-assign it using an i32
    impl ShlAssign<i32> for Vector2D {
        // we implement the shl_assign() method
        // shl_assign only mutates the original type
        // so we need a &mut self
        fn shl_assign(&mut self, rhs: i32) {
            self.0 <<= rhs;
            self.1 <<= rhs;
        }
    }

    // we create our mutable vector
    let mut vector = Vector2D(1, 1);

    // now shift-left-assigning a vector works

    vector <<= 10;
    println!("{:?}", vector); // prints Vector2D(1024, 1024)

    vector.shl_assign(10);
    println!("{:?}", vector); // prints Vector2D(1024, 1024)


}

`,

                "trait_signature": `
pub trait ShlAssign<Rhs = Self> {
    // Required method
    fn shl_assign(&mut self, rhs: Rhs);
}

`,
            },
            "ShrAssign": {
                "implementor": [
                    "I can be mutated to become the result of my right shifting by any value using one operation \"<<=\" or the shr_assign() method.",
                    "I can be \"shrassigned\" by any other type, and not only a similar type to myself, as it dependes on how ShrAssign was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the ShrAssign trait
    // and specify the type of right hand side
    // (the thing to the right of the ">>=" sign)
    // as i32, meaning we can only shift-right-assign it using an i32
    impl ShrAssign<i32> for Vector2D {
        // we implement the shr_assign() method
        // shr_assign only mutates the original type
        // so we need a &mut self
        fn shr_assign(&mut self, rhs: i32) {
            self.0 >>= rhs;
            self.1 >>= rhs;
        }
    }

    // we create our mutable vector
    let mut vector = Vector2D(1024, 1024);

    // now shift-right-assigning a vector works

    vector >>= 10;
    println!("{:?}", vector); // prints Vector2D(1, 1)

    vector.shr_assign(10);
    println!("{:?}", vector); // prints Vector2D(1, 1)


}

`,

                "trait_signature": `
pub trait ShrAssign<Rhs = Self> {
    // Required method
    fn shr_assign(&mut self, rhs: Rhs);
}

`,
            },
            "Not": {
                "implementor": [
                    "I can use the Not symbol \"!\" for logical negation, or any custom implemented functionality.",
                    "I do not necessarily output a type similar to myself as the result of the operation, as that also dependes on how Not was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the Not trait
    // with the functionality of the ! sign
    // to flip the sign of each component of the vector
    impl Not for Vector2D {
        // we define the output to be Vector2D
        type Output = Vector2D;

        // we implement the not() method which takes an owned self
        fn not(self) -> Self::Output {
            Vector2D(self.0 * -1, self.1 * -1)
        }
    }

    // we create our vector
    let vector = Vector2D(1, 1);

    // now using ! and .not() on the vector works
    println!("{:?}", !vector); // prints Vector2D(-1, -1)
    println!("{:?}", vector.not()); // prints Vector2D(-1, -1)


}

`,

                "trait_signature": `
pub trait Not {
    type Output;

    // Required method
    fn not(self) -> Self::Output;
}

`,
            },
            "Neg": {
                "implementor": [
                    "I can use the Negation symbol \"-\" for negation, or any custom implemented functionality.",
                    "I do not necessarily output a type similar to myself as the result of the operation, as that also dependes on how Neg was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the Neg trait
    // with the functionality of the - sign
    // to negate the sign of each component of the vector
    impl Neg for Vector2D {
        // we define the output to be Vector2D
        type Output = Vector2D;

        // we implement the neg() method which takes an owned self
        fn neg(self) -> Self::Output {
            Vector2D(self.0 * -1, self.1 * -1)
        }
    }

    // we create our vector
    let vector = Vector2D(1, 1);

    // now using - and .neg() on the vector works
    println!("{:?}", -vector); // prints Vector2D(-1, -1)
    println!("{:?}", vector.neg()); // prints Vector2D(-1, -1)


}

`,

                "trait_signature": `
pub trait Neg {
    type Output;

    // Required method
    fn neg(self) -> Self::Output;
}

`,
            },
            "Index": {
                "implementor": [
                    "I can be indexed like an array using the bracket syntax [] and the .index() method.",
                    "I can only be indexed immutably, meaning I can only be indexed to read values out of me.",
                    "My indexing can be a custom implemented functionality and is not necessarily array-like indexing, as it dependes on how Index was implemented for me",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented for some std collection types.",
                ],
                "examples": `
fn main() {

    // we create a days of the week type
    #[derive(Debug, Clone, Copy)]
    enum Days {
        Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, NotADay,
    }

    // we implement the Index trait
    // to have the functionality of knowing
    // what day of the week will coincide with 
    // whatever positive day displacement we provide
    impl Index<usize> for Days {

        // we define the output to be a Day
        type Output = Days;

        // we implement the index() method
        fn index(&self, index: usize) -> &Self::Output {

            // we get the current day number
            let current_day_number = self.clone() as usize + 1;

            // we find out which day of the week it coincides with
            match (index + current_day_number) % 7 {
                1 => &Days::Monday,
                2 => &Days::Tuesday,
                3 => &Days::Wednesday,
                4 => &Days::Thursday,
                5 => &Days::Friday,
                6 => &Days::Saturday,
                7 => &Days::Sunday,
                _ => &Days::NotADay,
            }
        }
    }

    // now we can find out what day of the week
    // is going to coincide with 100 days from Tuesday
    println!("{:?}", Days::Tuesday[100]); // prints Thursday


}

`,

                "trait_signature": `
pub trait Index<Idx>
where
    Idx: ?Sized,
{
    type Output: ?Sized;

    // Required method
    fn index(&self, index: Idx) -> &Self::Output;
}

`,
            },
            "IndexMut": {
                "implementor": [
                    "I can be indexed like an array using the bracket syntax [] and the .index_mut() method.",
                    "I can be indexed mutably, meaning I can be indexed to update values inside of me.",
                    "My indexing can be a custom implemented functionality and is not necessarily array-like indexing, as it dependes on how Index was implemented for me",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented for few std types.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    #[derive(Debug)]
    struct DaysWorked {
        Monday: i32,
        Tuesday: i32,
        Wednesday: i32,
        Thursday: i32,
        Friday: i32,
        Saturday: i32,
        Sunday: i32,
        NotADay: i32,
    }

    // we first implement Index
    // IndexMut cannot be implemented for a type
    // without Index also being implemented
    impl Index<usize> for DaysWorked {
        type Output = i32;
        fn index(&self, index: usize) -> &Self::Output {
            match index {
                1 => &self.Monday,
                2 => &self.Tuesday,
                3 => &self.Wednesday,
                4 => &self.Thursday,
                5 => &self.Friday,
                6 => &self.Saturday,
                _ => &self.Sunday,
            }
        }
    }
    // we implement the IndexMut trait
    // to have the functionality of changing
    // how many times we worked that day of the week
    impl IndexMut<usize> for DaysWorked {
        // we implement the index_mut() method
        fn index_mut(&mut self, index: usize) -> &mut Self::Output {
            match index {
                1 => &mut self.Monday,
                2 => &mut self.Tuesday,
                3 => &mut self.Wednesday,
                4 => &mut self.Thursday,
                5 => &mut self.Friday,
                6 => &mut self.Saturday,
                _ => &mut self.Sunday,
            }

        }
    }

    // we create our DaysWorked variable
    let mut days = DaysWorked {
        Monday:1,
        Tuesday:3,
        Wednesday:2,
        Thursday:0,
        Friday:0,
        Saturday:0,
        Sunday:0,
        NotADay:0,
    }

    // now we can change the number of times
    // we worked in Tuesday 
    println!("{:?}", days[2]); // it prints 3

    // we mutate days
    days[2] = 10;
    println!("{:?}", days[2]); // now it prints 10


}

`,

                "trait_signature": `
pub trait IndexMut<Idx>: Index<Idx>
where
    Idx: ?Sized,
{
    // Required method
    fn index_mut(&mut self, index: Idx) -> &mut Self::Output;
}

`,
            },
            "BitAnd": {
                "implementor": [
                    "I am capable of using the bitwise AND operator via the \"&\" symbol and the .bitand() method.",
                    "I'm not restricted to only being \"ANDed\" with a variable of the same type, any other type can also be used as that depends on the how BitAnd was implemented for me.",
                    "I do not necessarily output a type similar to myself as the result of the AND operation, as that also dependes on how BitAnd was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    // we will implement BitAnd to operate on each
    // component of the vector
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the BitAnd trait for Vector2D
    // and specify the type of right hand side
    // (the thing to the right of the & sign)
    // as Vector2D, meaning we implement it to
    // only being "anded" with a variable of the same type
    impl BitAnd<Vector2D> for Vector2D {
        // we specify the type of the output of the operation
        type Output = Vector2D;

        // we implement the bitand() method
        fn bitand(self, rhs: Vector2D) -> Self::Output {
            Vector2D(self.0 & rhs.0, self.1 & rhs.1)
        }
    }

    // we create a Vector2D
    let a = Vector2D(1, 2);

    // we can now "and" it with a Vector2D
    // because we implemented BitAnd<Vector2D>
    // "anding" a value with itself does nothing
    println!("{:?}", a & Vector2D(1, 2)); // outputs Vector2D(1, 2)
    println!("{:?}", a.bitand(Vector2D(1, 2))); // outputs Vector2D(1, 2)

    // but this won't work
    // because we didn't implement BitAnd<i32>
    println!("{:?}", a & 2); // compiler error
    println!("{:?}", a.bitand(2)); // compiler error


}

`,

                "trait_signature": `
pub trait BitAnd<Rhs = Self> {
    type Output;

    // Required method
    fn bitand(self, rhs: Rhs) -> Self::Output;
}

`,
            },
            "BitOr": {
                "implementor": [
                    "I am capable of using the bitwise OR operator via the \"|\" symbol and the .bitor() method.",
                    "I'm not restricted to only being \"ORed\" with a variable of the same type, any other type can also be used as that depends on the how BitOr was implemented for me.",
                    "I do not necessarily output a type similar to myself as the result of the OR operation, as that also dependes on how BitOr was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    // we will implement BitOr to operate on each
    // component of the vector
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the BitOr trait for Vector2D
    // and specify the type of right hand side
    // (the thing to the right of the | sign) as Vector2D
    // meaning we implement it to
    // only being "ored" with a variable of the same type
    impl BitOr<Vector2D> for Vector2D {
        // we specify the type of the output of the operation
        type Output = Vector2D;

        // we implement the bitor() method
        fn bitor(self, rhs: Vector2D) -> Self::Output {
            Vector2D(self.0 | rhs.0, self.1 | rhs.1)
        }
    }

    // we create a Vector2D
    let a = Vector2D(1, 2);

    // we can now "or" it with a Vector2D
    // because we implemented BitOr<Vector2D>
    // "oring" a value with itself does nothing
    println!("{:?}", a | Vector2D(1, 2)); // outputs Vector2D(1, 2)
    println!("{:?}", a.bitor(Vector2D(1, 2))); // outputs Vector2D(1, 2)

    // but this won't work
    // because we didn't implement BitOr<i32>
    println!("{:?}", a | 2); // compiler error
    println!("{:?}", a.bitor(2)); // compiler error


}

`,

                "trait_signature": `
pub trait BitOr<Rhs = Self> {
    type Output;

    // Required method
    fn bitor(self, rhs: Rhs) -> Self::Output;
}

`,
            },
            "BitXor": {
                "implementor": [
                    "I am capable of using the bitwise XOR operator via the \"^\" symbol and the .bitxor() method.",
                    "I'm not restricted to only being \"XORed\" with a variable of the same type, any other type can also be used as that depends on the how BitXor was implemented for me.",
                    "I do not necessarily output a type similar to myself as the result of the XOR operation, as that also dependes on how BitXor was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    // we will implement BitXor to operate on each
    // component of the vector
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the BitXor trait for Vector2D
    // and specify the type of right hand side
    // (the thing to the right of the ^ sign) as Vector2D
    // meaning we implement it to
    // only being "xored" with a variable of the same type
    impl BitXor<Vector2D> for Vector2D {
        // we specify the type of the output of the operation
        type Output = Vector2D;

        // we implement the bitxor() method
        fn bitxor(self, rhs: Vector2D) -> Self::Output {
            Vector2D(self.0 ^ rhs.0, self.1 ^ rhs.1)
        }
    }

    // we create a Vector2D
    let a = Vector2D(1, 2);

    // we can now "xor" it with a Vector2D
    // because we implemented BitXor<Vector2D>
    // "xoring" a value with itself returns zero
    println!("{:?}", a ^ Vector2D(1, 2)); // outputs Vector2D(0, 0)
    println!("{:?}", a.bitxor(Vector2D(1, 2))); // outputs Vector2D(0, 0)

    // but this won't work
    // because we didn't implement BitXor<i32>
    println!("{:?}", a ^ 2); // compiler error
    println!("{:?}", a.bitxor(2)); // compiler error


}

`,

                "trait_signature": `
pub trait BitXor<Rhs = Self> {
    type Output;

    // Required method
    fn bitxor(self, rhs: Rhs) -> Self::Output;
}

`,
            },
            "BitAndAssign": {
                "implementor": [
                    "I can be mutated to become the result of applying the logical AND operation with me and any value using a single operation \"&=\" or the bitand_assign() method.",
                    "I can be \"and-assigned\" with any other type, and not only a similar type to myself, as it dependes on how BitAndAssign was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    // we will implement BitAndAssign to operate on each
    // component of the vector
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the BitAndAssign trait
    // and specify the type of right hand side
    // (the thing to the right of the "&=" sign)
    // as i32, meaning we can only and-assign it using an i32
    impl BitAndAssign<i32> for Vector2D {
        // we implement the bitand_assign() method
        // bitand_assign only mutates the original type
        // so we need a &mut self
        fn bitand_assign(&mut self, rhs: i32) {
            self.0 &= rhs;
            self.1 &= rhs;
        }
    }

    // we create our mutable vector
    let mut vector = Vector2D(1, 1);

    // now and-assigning a vector with an i32 type works
    // 1 & 2 equals 0
    // so our operation should return Vector2D(0, 0)
    vector &= 2;
    println!("{:?}", vector); // prints Vector2D(0, 0)

    vector.bitand_assign(2);
    println!("{:?}", vector); // prints Vector2D(0, 0)


}

`,

                "trait_signature": `
pub trait BitAndAssign<Rhs = Self> {
    // Required method
    fn bitand_assign(&mut self, rhs: Rhs);
}

`,
            },
            "BitOrAssign": {
                "implementor": [
                    "I can be mutated to become the result of applying the logical OR operation with me and any value using a single operation \"|=\" or the bitor_assign() method.",
                    "I can be \"or-assigned\" with any other type, and not only a similar type to myself, as it dependes on how BitOrAssign was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    // we will implement BitOrAssign to operate on each
    // component of the vector
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the BitOrAssign trait
    // and specify the type of right hand side
    // (the thing to the right of the "|=" sign)
    // as i32, meaning we can only or-assign it using an i32
    impl BitOrAssign<i32> for Vector2D {
        // we implement the bitor_assign() method
        // bitor_assign only mutates the original type
        // so we need a &mut self
        fn bitor_assign(&mut self, rhs: i32) {
            self.0 |= rhs;
            self.1 |= rhs;
        }
    }

    // we create our mutable vector
    let mut vector = Vector2D(1, 1);

    // now or-assigning a vector with an i32 type works
    // 1 | 2 equals 3
    // so our operation should return Vector2D(3, 3)
    vector |= 2;
    println!("{:?}", vector); // prints Vector2D(3, 3)

    vector.bitor_assign(2);
    println!("{:?}", vector); // prints Vector2D(3, 3)


}

`,

                "trait_signature": `
pub trait BitOrAssign<Rhs = Self> {
    // Required method
    fn bitor_assign(&mut self, rhs: Rhs);
}

`,
            },
            "BitXorAssign": {
                "implementor": [
                    "I can be mutated to become the result of applying the logical XOR operation with me and any value using a single operation \"^=\" or the bitxor_assign() method.",
                    "I can be \"xor-assigned\" with any other type, and not only a similar type to myself, as it dependes on how BitXorAssign was implemented for me.",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented by default for all numeric types like i32, f64, ..etc.",
                ],
                "examples": `
fn main() {

    // we create a new 2-Dimensional vector type
    // we will implement BitXorAssign to operate on each
    // component of the vector
    #[derive(Debug)]
    struct Vector2D(i32, i32);

    // we implement the BitXorAssign trait
    // and specify the type of right hand side
    // (the thing to the right of the "^=" sign)
    // as i32, meaning we can only or-assign it using an i32
    impl BitXorAssign<i32> for Vector2D {
        // we implement the bitxor_assign() method
        // bitxor_assign only mutates the original type
        // so we need a &mut self
        fn bitxor_assign(&mut self, rhs: i32) {
            self.0 ^= rhs;
            self.1 ^= rhs;
        }
    }

    // we create our mutable vector
    let mut vector = Vector2D(1, 1);

    // now xor-assigning a vector with an i32 type works
    // 1 ^ 2 equals 3
    // so our operation should return Vector2D(3, 3)
    vector ^= 2;
    println!("{:?}", vector); // prints Vector2D(3, 3)

    vector.bitxor_assign(2);
    println!("{:?}", vector); // prints Vector2D(3, 3)


}

`,

                "trait_signature": `
pub trait BitXorAssign<Rhs = Self> {
    // Required method
    fn bitxor_assign(&mut self, rhs: Rhs);
}

`,
            },
            "Deref": {
                "implementor": [
                    "I can provide custom logic when I'm dereferenced with the \"*\" symbol through a .deref() method that I implement.",
                    "Every method that's available on the Target type I dereference to, is also available for me to use (Because I dereference to that Target, I do not actually implement these methods).",
                    "The compiler will automatically coerce me (convert me) into my Deref Target type If I'm in a place where that type is expected but I'm there instead (this is called Deref Coercion).",
                    "The compiler only coerces me when I'm a reference, (It only coerces &Me => &Target), it does not coerce me when I'm not a reference (coercing Me => Target does not happen).",
                    "I am a smart pointer (This is the convention that's expected, Deref and DerefMut are traits for smart pointers, but this is not an enforced rule).",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented for all smart pointer types/async/sync primitives.",
                    "I handle dereferencing in immutable contexts (reading data).",
                    "I appear like I provide inheritance for Rust types, but I do not, I provide automatic conversion (dereferencing).",
                ],
                "examples": `
fn main() {

    // we create a type NumBox
    struct NumBox {
        num: i32,
    }
    // we implement Deref for NumBox
    // to dereference into its inner num field
    impl Deref for NumBox {
        type Target = i32;
        fn deref(&self) -> &Self::Target {
            // we return a reference to the inner field
            &self.num
        }
    }

    // we create our NumBox instance
    let numbox = NumBox { num: 10 };

    // we dereference it here
    // dereferencing it automatically calls the .deref() method
    let num: i32 = *numbox;

    // the above line is equivalent to the following line
    let num2: i32 = *Deref::deref(&numbox);

    println!("{:?}", num); // prints 10
    println!("{:?}", num2); // also prints 10

    // both of these next lines work
    // the first one is the default case
    // the second one is the rust compiler doing deref coercion
    // after realizing the annotated type is not the default type &NumBox
    let a: &NumBox = &numbox;
    let a: &i32 = &numbox;

    // the second line is just doing this
    let a: &i32 = Deref::deref(&numbox);
    
    // this next line however does not work
    // the rust compiler does not do Coercion when the type is owned
    let a: i32 = numbox; // compiler error


    // now we create a new trait and implement it for i32
    // the trait simply implements a function that prints "Hi"
    trait new_trait {
        fn say_hi(&self) {}
    }

    impl new_trait for i32 {
        fn say_hi(&self) {
            println!("Hi");
        }
    }

    // we try to call say_hi on numbox
    // and it shouldn't work because NumBox does not implement new_trait
    // only i32 implements new_trait
    // but because NumBox's dereferenced Target is an i32
    // the rust compiler dereferences numbox and finds num
    // and it sees that num is an i32 and it has that method
    // so it calls successfully
    numbox.say_hi();

    // the above line is equivalent to the following
    numbox.num.say_hi();


}

`,

                "trait_signature": `
pub trait Deref {
    type Target: ?Sized;

    // Required method
    fn deref(&self) -> &Self::Target;
}

`,
            },
            "DerefMut": {
                "implementor": [
                    "I can provide custom logic when I'm dereferenced in mutable contexts (my values are being mutated/updated) with the \"*\" symbol through a .deref_mut() method that I implement.",
                    "Every method that's available on the Target type I dereference to, is also available for me to use (Because I dereference to that Target, I do not actually implement these methods).",
                    "The compiler will automatically coerce me (convert me) into my DerefMut Target type If I'm in a place where that type is expected but I'm there instead (this is called Mutable Deref Coercion).",
                    "The compiler only coerces me when I'm a mutable reference, (It only coerces &mut Me => &mut Target), it does not coerce me when I'm not a mutable reference (coercing Me => Target does not happen).",
                    "I am a smart pointer (This is the convention that's expected, Deref and DerefMut are traits for smart pointers, but this is not an enforced rule).",
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented for all smart pointer types/async/sync primitives.",
                    "I am the version of the Deref trait that handles dereferencing in mutable contexts (mutating data).",
                ],
                "examples": `
fn main() {

    // we create a type NumBox
    struct NumBox {
        num: i32,
    }
    // we implement Deref for NumBox
    // (DerefMut requires Deref to be implemented)
    impl Deref for NumBox {
        type Target = i32;
        fn deref(&self) -> &Self::Target {
            &self.num
        }
    }

    // we now implement DerefMut
    impl DerefMut for NumBox {
        fn deref_mut(&mut self) -> &mut Self::Target {
            // we return a mutable reference to the inner field
            &mut self.num
        }
    }

    // we create our mutable NumBox instance
    let mut numbox = NumBox { num: 10 };

    // we mutably dereference it here
    // because we're dereferencing it here in a mutating context 
    // (we're mutating/updating numbox's values) 
    // it automatically calls the .deref_mut() method
    *numbox = 100;

    // the above line is equivalent to the following line
    *DerefMut::deref_mut(&mut numbox) = 100;

    // now the inner num field is updated 
    println!("{:?}", numbox.num); // this prints 100
    println!("{:?}", numbox.num); // also prints 100

    // both of these next lines work
    // the first one is the default case
    // the second one is the rust compiler doing mutable deref coercion
    // after realizing the annotated type is not the default type &mut NumBox
    let a: &mut NumBox = &mut numbox;
    let a: &mut i32 = &mut numbox;

    // the second line is just doing this
    let a: &mut i32 = DerefMut::deref_mut(&mut numbox);

    // this next line however does not work
    // the rust compiler does not do Coercion when the type is owned
    let a: i32 = numbox; // compiler error

    // now we create a new trait and implement it for i32
    // the trait simply implements a function that prints "Hi"
    trait new_trait {
        fn say_hi(&mut self) {}
    }

    impl new_trait for i32 {
        fn say_hi(&mut self) {
            println!("Hi");
        }
    }

    // we try to call say_hi on numbox
    // and it shouldn't work because NumBox does not implement new_trait
    // only i32 implements new_trait
    // but because NumBox's dereferenced Target is an i32
    // the rust compiler mutably dereferences numbox and finds num
    // and it sees that num is an i32 and it has that method
    // so it calls successfully
    numbox.say_hi();

    // the above line is equivalent to the following
    numbox.num.say_hi();


}

`,

                "trait_signature": `
pub trait DerefMut: Deref {
    // Required method
    fn deref_mut(&mut self) -> &mut Self::Target;
}

`,
            },
            "RangeBounds": {
                "implementor": [
                    "I'm a Rust range, meaning I'm one of the six Rust ranges provided by the language: (..), (num..), (num..num), (num..=num), (..num), (num..=num).",
                    "I can also be a custom type that's not a Rust range that implements the RangeBounds trait.",
                    "I can be interrogated to find out what my bounds are (beginning and end of me).",
                    "I can find out whether these limits/end points are bounded or unbounded (go to infinity or not) and if they're not unbounded also whether they're included or excluded (end points as part of range or excluded).",
                ],
                "trait": [
                    "I can't be derived.",
                    "I can't create or be part of a trait object (not Object-Safe), because the contains() method is generic and trait object vtables do not handle monomorphization.",
                    "I am implemented for all the Rust std Range types.",
                ],
                "examples": `
fn main() {

    // the RangeBounds trait uses the Bounds struct
    // in the std::ops module to communicate
    // the three cases of end point 
    // Unbounded, Included(value), Excluded(value) 

    // all Rust standard library ranges implement RangeBounds

    let a: RangeFull =                   ..       ;
    let b: RangeFrom<i32> =           100..       ; 
    let c: RangeTo<i32> =                ..100    ;
    let d: Range<i32> =               100..100    ;
    let e: RangeToInclusive<i32> =       ..=100   ;
    let f: RangeInclusive<i32> =      100..=100   ;

    println!("{:?}", RangeBounds::<i32>::end_bound(&a));   // prints Unbounded
    println!("{:?}", RangeBounds::<i32>::start_bound(&b)); // prints Included(100)
    println!("{:?}", RangeBounds::<i32>::end_bound(&c));   // prints Excluded(100)

    // the RangeBounds trait also has a contains() method
    // which returns whether the argument is included in the range
    println!(c.contains(&2));					  // prints true 

}

`,

                "trait_signature": `
pub trait RangeBounds<T>
where
    T: ?Sized,
{
    // Required methods
    fn start_bound(&self) -> Bound<&T>;
    fn end_bound(&self) -> Bound<&T>;

    // Provided method
    fn contains(&self, ...)
}

`,
            },
            "Drop": {
                "implementor": [
                    "I am automatically dropped by the rust compiler when i go out of scope.",
                    "I can have custom functionality or clean up logic implemented for me prior to me being dropped.",
                ],
                "trait": [
                    "I am used to implement clean up functionalities for the resources that the type that implements me was using in its lifetime, like file handles, network sockets, etc..",
                    "My drop() method gets called automatically the type that implements me goes out of scope, I dont need to be explicitly called",
                    "Infact my drop method is not allowed to be explicitly called before the scope ends. For explicit dropping therefore, the std::mem::drop() method is used (it also executes the cleanup thats in ops::Drop)"
                ],
                "examples": `
fn main() {

    // we create a new type String_Wrapper
    #[derive(Debug)]
    struct String_Wrapper(String);

    // we implement Drop for our type
    // with the only functionality
    // to do pseudo clean up work
    // and print that the variable is dropped
    impl Drop for String_Wrapper {
        fn drop(&mut self) {
            println!("pseudo-cleaning-up");
            println!("String wrapper is dropped");
        }
    }

    // we create a String_Wrapper variable
    let mut s = String_Wrapper(String::from("string"));
    
    // we are unable to explicitly call drop on s
    // because Rust does not allow that
    s.drop(); // this results in a compiler error

    // to drop our s variable manually
    // we instead use the drop function
    // on the mem module
    // so the following line successfully drops s
    std::mem::drop(s);
    // "pseudo-cleaning-up" is printed
    // "String wrapper is dropped" is printed

    // s no longer exist, so this println wont compile
    println!("{:?}", s); // compiler error
    
    
    // we create a new String_Wrapper variable s
    let mut s = String_Wrapper(String::from("string"));


    // now that the scope is at its end
    // s is dropped automatically by the Rust Compiler

    // "pseudo-cleaning-up" is printed
    // "String wrapper is dropped" is printed


}

`,

                "trait_signature": `
pub trait Drop {
    // Required method
    fn drop(&mut self);
}

`,
            },
            "Fn": {
                "implementor": [
                    "I'm a closure that runs many times without mutating the captured variables from its scope (I implement Fn).",
                    "I capture some environment values by reference non mutably.",
                    "FnMut has to also be implemented for me to work."
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented for every closure that does not mutate captured scope variables.",
                    "I am the least restrictive closure type.",
                    "My implementors can be used everywhere a closure is expected because I'm the least restrictive closure trait.",
                ],
                "examples": `
fn main() {


    // we defind a function that takes an Fn
    fn takes_closure(mut closure: impl Fn()) {
        // it just runs it
        closure();
    }
    
    // we define a scope variable 
    // that will be captured by our closure
    let a = String::from("a");
    
    // we define a closure that just drops the captured String
    // and because it drops the String
    // the compiler automatically implements FnOnce
    // and the String is moved inside the closure
    let closure_once = || mem::drop(a);
    
    // we define another scope variable 
    // that will be captured by our closure
    let mut b = String::from("b");
    
    // but this time in our closure 
    // we mutate it instead of dropping it
    // and because the compiler sees that we mutated the string
    // it implements FnMut (which automatically implements FnOnce)
    let closure_many_times_mut = || b.push_str("b");
    
    // we define another scope variable 
    // that will be captured by our closure
    let c = String::from("c");
    
    // but this time our closure  
    // doesn't mutate it, it only reads it 
    // and because the compiler sees that we did not change the string
    // it implements Fn (which automatically implements FnMut & FnOnce)
    let closure_many_times = || println!("{:?}", c);

    // we see that we can't pass an FnOnce to our function 
    // because FnOnce only runs one time 
    // and we explicitly specify a closure that runs many times
    takes_closure(closure_once); // compiler error
    
    // we see that we also can't pass our FnMut to our function 
    // because FnMut cannot accomodate shared access 
    // and we explicitly specify a closure that requires that
    takes_closure(closure_many_times_mut); // compiler error

    // we pass our Fn closure and it works 
    takes_closure(closure_many_times); 


}

`,

                "trait_signature": `
pub trait Fn<Args>: FnMut<Args>
where
    Args: Tuple,
{
    // Required method
    extern "rust-call" fn call(&self, args: Args) -> Self::Output;
}

`,
            },
            "FnMut": {
                "implementor": [
                    "I'm a closure that runs many times and mutates captured variables from its scope (I implement FnMut).",
                    "I might also be a closure that runs many time and without mutating the environment (I implement FnMut along with Fn).",
                    "I capture some environment values by reference mutably.",
                    "FnOnce has to also be implemented for me to work."
                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented for every closure that mutates captured scope variables.",
                    "I am implemented for every Fn closure (closures that do not mutate their data but run many times).",
                    "My implementors can not be used where implementors of Fn are expected, because being expected to allow shared access (borrowing) when I am only capable of providing exclusive access (mutable borrowing) is destructive (Rust will not allow this anyways), but the other way around is allowed because any closure that can accomodate shared access can also accomodate exclusive access.",
                ],
                "examples": `
fn main() {

    // we defind a function that takes an FnMut
    fn takes_closure(mut closure: impl FnMut()) {
        // it just runs it
        closure();
    }
    
    // we define a scope variable 
    // that will be captured by our closure
    let a = String::from("a");
    
    // we define a closure that just drops the captured String
    // and because it drops the String
    // the compiler automatically implements FnOnce
    // and the String is moved inside the closure
    let closure_once = || mem::drop(a);
    
    // we define another scope variable 
    // that will be captured by our closure
    let mut b = String::from("b");
    
    // but this time in our closure 
    // we mutate it instead of dropping it
    // and because the compiler sees that we mutated the string
    // it implements FnMut (which automatically implements FnOnce)
    let closure_many_times_mut = || b.push_str("b");
    
    // we define another scope variable 
    // that will be captured by our closure
    let c = String::from("c");
    
    // but this time our closure  
    // doesn't mutate it, it only reads it 
    // and because the compiler sees that we did not change the string
    // it implements Fn (which automatically implements FnMut & FnOnce)
    let closure_many_times = || println!("{:?}", c);

    // we see that we can't pass an FnOnce to our function 
    // because FnOnce only runs one time 
    // and we explicitly specify a closure that runs many times mutably
    takes_closure(closure_once); // compiler error
    
    // we pass our FnMut closure and it works 
    takes_closure(closure_many_times_mut); 

    // we also pass our closure that runs many times 
    // but does not mutate its captured values (Fn) 
    // and it also works because Fn implements FnMut
    takes_closure(closure_many_times); 



}

`,

                "trait_signature": `
pub trait FnMut<Args>: FnOnce<Args>
where
    Args: Tuple,
{
    // Required method
    extern "rust-call" fn call_mut(
        &mut self,
        args: Args
    ) -> Self::Output;
}

`,
            },

            "FnOnce": {
                "implementor": [
                    "I'm a closure that can run *at least* one time.",
                    "I might be a closure that can run *Only one time* (I implement FnOnce only).",
                    "I might also be a closure that runs many times while mutating the environment (I implement FnOnce along with FnMut).",
                    "I might also be a closure that runs many time and without mutating the environment (I implement FnOnce along with FnMut along with Fn).",
                    "I capture some environment values by value (I move and own some values from my scope).",

                ],
                "trait": [
                    "I can't be derived.",
                    "I am implemented for all closure types because all closures can run at least one time.",
                    "My implementors can not be used where implementors of FnMut or Fn are expected, because being expected to run many times when I allow running only once is destructive (Rust will not allow this anyways), but the other way around is allowed because any closure that can run many times is capable of running one time.",

                ],
                "examples": `
fn main() {

    // we defind a function that takes an FnOnce
    fn takes_closure(closure: impl FnOnce()) {
        // it just runs it
        closure();
    }
    
    // we define a scope variable 
    // that will be captured by our closure
    let a = String::from("a");
    
    // we define a closure that just drops the captured String
    // and because it drops the String
    // the compiler automatically implements FnOnce
    // and the String is moved inside the closure
    let closure_once = || mem::drop(a);
    
    // we define another scope variable 
    // that will be captured by our closure
    let mut b = String::from("b");
    
    // but this time in our closure 
    // we mutate it instead of dropping it
    // and because the compiler sees that we mutated the string
    // it implements FnMut (which automatically implements FnOnce)
    let closure_many_times_mut = || b.push_str("b");
    
    // we define another scope variable 
    // that will be captured by our closure
    let c = String::from("c");
    
    // but this time our closure  
    // doesn't mutate it, it only reads it 
    // and because the compiler sees that we did not change the string
    // it implements Fn (which automatically implements FnMut & FnOnce)
    let closure_many_times = || println!("{:?}", c);

    // and all of them can be passed to our function
    // because FnOnce is the base closure trait
    takes_closure(closure_once);
    
    // a closure that runs many times 
    // and mutates its captured values (FnMut)
    // also works becaue FnMut implements FnOnce
    takes_closure(closure_many_times_mut); 

    // a closure that runs many times 
    // and does not mutate its captured values (Fn) also works 
    // because Fn implements FnMut which implements FnOnce
    takes_closure(closure_many_times); 


}

`,

                "trait_signature": `
pub trait FnOnce<Args>
where
    Args: Tuple,
{
    type Output;

    // Required method
    extern "rust-call" fn call_once(self, args: Args) -> Self::Output;
}

`,
            },
        },
    },
    "str": {
        "introductory": "I contain str traits",
        "traits": {
            "FromStr": {
                "implementor": [
                    "I can be created from a string slice using a .from_str() that I provide.",
                    "The operation of creating me might fail."

                ],
                "trait": [
                    "I can't be derived.",
                    "I can't create or be part of a trait object (not Object-Safe), because I require the type I'm implemented for to have a Size known at compile time, and trait objects are Dynamically Sized Types, so the compiler will not be able to implement the FromStr trait for the trait object.",
                    "I allow failure, so I return a Result.",

                ],
                "examples": `
fn main() {

    // we create our struct 
    #[derive(Debug)]
    struct NumBox { num: i32 }
    
    // we define an error type 
    // to use in the FromStr associated error type 
    #[derive(Debug)]
    struct Error;

    // we implement FromStr for NumBox
    // to be able to create a NumBox from an &str
    impl FromStr for NumBox {
        type Err = Error;
        fn from_str(s: &str) -> Result<Self, Self::Err> {
            Ok(Self {
                // we just parse whatever &str we got
                num: str::parse::<i32>(&s).unwrap(),
            })
        }
    }

    // Now we can create a NumBox from an &str
    let numbox = NumBox::from_str("10").unwrap();
    
    // and it successfully works
    println!("{numbox:?}"); // prints NumBox { num: 10 }


}

`,

                "trait_signature": `
pub trait FromStr: Sized {
    type Err;

    // Required method
    fn from_str(s: &str) -> Result<Self, Self::Err>;
}

`,
            },
        },
    },
    "any": {
        "introductory": "I emulate dynamic typing like in higher level languages via the Any trait",
        "traits": {
            "Any": {
                "implementor": [
                    "I have access to a .type_id() method to figure out what type I am at runtime.",
                    "I can figure out what type I am when I am inside generice code where type data is lost."
                ],
                "trait": [
                    "Because I am implemented for every type in the Rust language I can be used to emulate dynamic typing like in higher level languages by specifying the type of any type of data as &dyn any."
                ],
                "examples": `
fn main() {

    // String implements Any
    let any_type: &dyn Any = &String::from("a");
    
    // i32 implements Any
    let any_type: &dyn Any = &2;
    
    // Vec implements Any
    let any_type: &dyn Any = &vec![1, 2, 3, 4];
    
    // accepts any type as an argument
    // does not know what type it got
    // uses type_id() to figure that out at runtime
    fn is_string_or_not(any_type: &dyn Any) {
        println!("{}", TypeId::of::<String>() == any_type.type_id());
    }
    
    // accepts String argument, finds out it's String
    is_string_or_not(&String::from(""));
        
    // accepts i32 argument, finds out it's not String
    is_string_or_not(&2);
        
    // accepts Vec<i32> argument, finds out it's not String
    is_string_or_not(&vec![1, 2, 3]);

}

`,

                "trait_signature": `
pub trait Any: 'static {
    // Required method
    fn type_id(&self) -> TypeId;
}

`,
            },
        },
    },
}
