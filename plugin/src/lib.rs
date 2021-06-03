//use std::borrow::Cow;
use std::cell::RefCell;
use std::rc::Rc;

//use deno_core::error::bad_resource_id;
use deno_core::error::AnyError;
use deno_core::op_async;
use deno_core::op_sync;
use deno_core::Extension;
use deno_core::OpState;
//use deno_core::Resource;
//use deno_core::ResourceId;
use deno_core::ZeroCopyBuf;
use serde::Deserialize;

#[no_mangle]
pub fn init() -> Extension {
    Extension::builder()
        .ops(vec![
            ("hello_world", op_sync(hello_world)),
            ("hello_world_async", op_async(hello_world_async)),
            /*
            (
              "op_test_resource_table_add",
              op_sync(op_test_resource_table_add),
            ),
            (
              "op_test_resource_table_get",
              op_sync(op_test_resource_table_get),
            ),*/
        ])
        .build()
}

#[derive(Debug, Deserialize)]
struct TestArgs {
    val: String,
    foo: usize,
}

fn hello_world(
    _state: &mut OpState,
    args: TestArgs,
    zero_copy: Option<ZeroCopyBuf>,
) -> Result<String, AnyError> {
    println!("Hello from sync hello_world op.");

    println!("args: {:?}", args);

    if let Some(buf) = zero_copy {
        let buf_str = std::str::from_utf8(&buf[..])?;
        println!("zero_copy: {}", buf_str);
    }

    Ok("test".to_string())
}

async fn hello_world_async(
    _state: Rc<RefCell<OpState>>,
    args: TestArgs,
    zero_copy: Option<ZeroCopyBuf>,
) -> Result<String, AnyError> {
    println!("Hello from async hello_world op.");

    println!("args: {:?}", args);

    if let Some(buf) = zero_copy {
        let buf_str = std::str::from_utf8(&buf[..])?;
        println!("zero_copy: {}", buf_str);
    }

    let (tx, rx) = futures::channel::oneshot::channel::<Result<(), ()>>();
    std::thread::spawn(move || {
        std::thread::sleep(std::time::Duration::from_secs(1));
        tx.send(Ok(())).unwrap();
    });
    assert!(rx.await.is_ok());

    Ok("test".to_string())
}
