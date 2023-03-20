import { Layout, Popover, ActionList, TopBar, Frame, Badge, SkeletonBodyText, Heading, Tabs, ButtonGroup, MediaCard, VideoThumbnail, DataTable, Button, EmptyState, Card, Page, TextField, Icon, Stack, Avatar, Image, Modal, FormLayout, Select, Checkbox, DropZone, Thumbnail, TextStyle, Pagination } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import Switch from "react-switch";
import { useNavigationHistory, useToast } from "@shopify/app-bridge-react";
import { Axios } from  "../Axios";
import store from "store2";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { ChevronDownMinor, SearchMinor, NoteMinor, SearchMajor, DeleteMajor, AnalyticsMajor, EditMajor, FolderDownMajor, ArrowLeftMinor } from "@shopify/polaris-icons";
import { useNavigate, useParams } from "react-router";
import {
    announceIcon,
    logoImage,
    creditIcon,
    notification,
    closeImage
  } from '../assets';
  import music1 from "../assets/music-svgrepo-com.png";
  import logo1 from "../assets/logo.png";
  import music_emptyState from "../assets/music_emptyState.png";
  

export default function PackPage() {
    const { id } = useParams();
    const { show } = useToast();
    const {replace} = useNavigationHistory();
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(25);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [delete_modal_active, setDeleteModalActive] = useState(false);
    const [active, setActive] = useState(true);
    const handleChange = useCallback(() => setActive(!active), [active]);

    const [edit_active, setEditActive] = useState(true);
    const handleEditChange = useCallback(() => setEditActive(!edit_active), [edit_active]);

    const [add_pack, setAddPack] = useState(true);
    const [edit_pack, setEditPack] = useState(true);
    const [add_sample, setAddSample] = useState(true);
    const handleAddPack = useCallback(() => setAddPack(!add_pack), [add_pack]);
    const handleEditPack = useCallback(() => setEditPack(!edit_pack), [edit_pack]);

    const [delete_sample_id, setDeleteSampleId] = useState(null);
    let [priceChecked, setPriceChecked] = useState(false);
    let [editPriceChecked, setEditPriceChecked] = useState(false);

    const [searchValue, setSeachValue] = useState("");
    const searchInputOnChange = useCallback((searchValue) => setSeachValue(searchValue),[searchValue]);
    const [searchType, setSeachType] = useState("all");
    const searchTypeOnChange = useCallback((searchType) => setSeachType(searchType),[searchType]);

    const [updating_product, setUpdatingProduct] = useState(false);

    const [files, setFiles] = useState([]);

    const [products, setProducts] = useState(fake_products);
    const [creating_product, setCreatingProduct] = useState(false);
    const [editing_product, setEditingProduct] = useState(false);

    const [price, setPrice] = useState("50.00");
    const [description, setDescription] = useState("");
    const [title_name, setTitleName] = useState("");
    const [genre, setGenre] = useState("");
    const [current_page, setPage] = useState(1);
    const [pagination, setPagination] = useState(default_pagination);

    const [edit_price, setEditPrice] = useState('50.00');
    const [edit_description, setEditDescription] = useState("");
    const [edit_title_name, setEditTitleName] = useState("");
    const [edit_genre, setEditGenre] = useState("");

    const handleDescription = useCallback((description) => {setDescription(description)},[description]);
    const handleTitleName = useCallback((title_name) => {setTitleName(title_name)},[title_name]);
    const handleGenre = useCallback((genre) => {setGenre(genre)},[genre]);
    const handlePrice = useCallback((price) => {setPrice(price)},[price]);

    const handleEditDescription = useCallback((edit_description) => {setEditDescription(edit_description)},[edit_description]);
    const handleEditTitleName = useCallback((edit_title_name) => {setEditTitleName(edit_title_name)},[edit_title_name]);
    const handleEditGenre = useCallback((edit_genre) => {setEditGenre(edit_genre)},[edit_genre]);
    const handleEditPrice = useCallback((edit_price) => {setEditPrice(edit_price)},[edit_price]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [selected, setSelected] = useState(0);

    const [deleting_sample, setDeletingSample] = useState(false);

    const [pack_id, setPackId] = useState("");
    const [image_src, setImageSrc] = useState(music1);
    const [product_id, setProductId] = useState();

    const [popoverActive, setPopoverActive] = useState(false);

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

    function handleAddSample(){
        // useCallback(() => setAddSample(!add_sample), [add_sample]);
        navigate("/add-samples/"+product_id, {replace: true});
        replace({pathname: "/add-samples/"+product_id});
    }

    const tabs = [
        {
          id: 'explore_id',
          content: 'Explore',
          accessibilityLabel: 'Explore',
          panelID: 'explore_panel',
        },
        {
            id: 'packs_id',
            content: 'Packs',
            panelID: 'packs_panel',
        },
        {
          id: 'samples_id',
          content: 'Samples',
          panelID: 'samples_panel',
        },
        {
          id: 'selections_id',
          content: 'Selections',
          panelID: 'selections_panel',
        },
      ];

    const [activeStep, setActiveStep] = useState(0);
    const steps = tabs;

    const toggleIsUserMenuOpen = useCallback(
        () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
        [],
    );

    const toggleIsSecondaryMenuOpen = useCallback(
        () => setIsSecondaryMenuOpen((isSecondaryMenuOpen) => !isSecondaryMenuOpen),
        [],
    );

    // const handleSearchResultsDismiss = useCallback(() => {
    //     setIsSearchActive(false);
    //     setSearchValue('');
    // }, []);

    const handleSearchChange = useCallback((value) => {
        setSearchValue(value);
        setIsSearchActive(value.length > 0);
    }, []);

    const handleNavigationToggle = useCallback(() => {
        console.log('toggle navigation visibility');
    }, []);

    const logo = {
        width: 124,
        topBarSource:
        logo1,
        url: '#',
        accessibilityLabel: 'shephbeats',
    };

    

    const handleDropZoneDrop = useCallback( 
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
        setFiles((files) => [...files, ...acceptedFiles]),
        [],
    );

    const handleEditDropZoneDrop = useCallback( 
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
        setFiles((files) => [...files, ...acceptedFiles]),
        [],
    );

    const [samples, setSamples] = useState(fake_products);

    const userMenuMarkup = (
        <TopBar.UserMenu
          actions={[
            {
              items: [{content: 'Back to Shopify', icon: ArrowLeftMinor}],
            },
            {
              items: [{content: 'Community forums'}],
            },
          ]}
          name="Dharma"
          detail="Jaded Pixel"
          initials="D"
          open={isUserMenuOpen}
          onToggle={toggleIsUserMenuOpen}
        />
      );
    
    //   const searchResultsMarkup = (
    //     <ActionList
    //       items={[{content: 'Shopify help center'}, {content: 'Community forums'}]}
    //     />
    //   );
    
        const searchFieldMarkup = (
            <TopBar.SearchField
            // onChange={handleSearchChange}
            // value={searchValue}
            placeholder="Search"
            showFocusBorder
            />
        );
    const secondaryMenuMarkup = (
        <TopBar.Menu
          activatorContent={
            <span className='home-topbar'>
                <Stack>
                    <Button primary onClick={handleChange}>+ Add New Pack</Button>
                    <Image source={announceIcon} height={14} />
                    <Image source={notification} height={14} />
                    <Avatar customer name="Farrah" />
                    <Icon source={ChevronDownMinor} />
                </Stack>
            </span>
          }
        //   open={isSecondaryMenuOpen}
        //   onOpen={toggleIsSecondaryMenuOpen}
        //   onClose={toggleIsSecondaryMenuOpen}
        //   actions={[
        //     {
        //       items: [{content: 'Community forums'}],
        //     },
        //   ]}
        />
      );

    const topBarMarkup = (
        <TopBar
          showNavigationToggle
        //   userMenu={userMenuMarkup}
          secondaryMenu={secondaryMenuMarkup}
          searchResultsVisible={isSearchActive}
          searchField={searchFieldMarkup}
        //   searchResults={searchResultsMarkup}
        //   onSearchResultsDismiss={handleSearchResultsDismiss}
          onNavigationToggle={handleNavigationToggle}
        />
      );

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );
  
  

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !files.length && <DropZone.FileUpload />;
    const uploadedFiles = files.length > 0 && (
        <div style={{padding: '0'}}>
            <Stack vertical>
                {files.map((file, index) => (
                <Stack alignment="center" key={index}>
                    <Thumbnail
                    size="small"
                    alt={file.name}
                    source={
                        validImageTypes.includes(file.type)
                        ? window.URL.createObjectURL(file)
                        : NoteMinor
                    }
                    />
                    <div>
                    {file.name}{' '}
                    <TextStyle ext variant="bodySm" as="p">
                        {file.size} bytes
                    </TextStyle>
                    </div>
                </Stack>
                ))}
            </Stack>
        </div>
    );

    const editFileUpload = !files.length && <DropZone.FileUpload />;
    const editUploadedFiles = files.length > 0 && (
        <div style={{padding: '0'}}>
            <Stack vertical>
                {files.map((file, index) => (
                <Stack alignment="center" key={index}>
                    <Thumbnail
                    size="small"
                    alt={file.name}
                    source={
                        validImageTypes.includes(file.type)
                        ? window.URL.createObjectURL(file)
                        : NoteMinor
                    }
                    />
                    <div>
                    {file.name}{' '}
                    <TextStyle ext variant="bodySm" as="p">
                        {file.size} bytes
                    </TextStyle>
                    </div>
                </Stack>
                ))}
            </Stack>
        </div>
    );

    useEffect(() => {
        getPack();
    }, []);

    function DeleteSample(){
        setDeletingSample(true);
        setPage(1);
        Axios({
          type: "delete",
          url: "/merchant/sample/delete?id="+delete_sample_id+"&shop="+store("shop"),
          headers: {
            'Content-Type': 'application/json'
          },
        }, function(error, deleted){
          setDeleteModalActive(false);
          getPack();
          setLoading(true);
          setDeletingSample(false);
        });  
      }

    function getPack(){
        console.log("_id",id);
        getSamples(id);
        Axios({
            type: "get",
            url: "/merchant/get_pack?pack_id="+id,
            headers: {
                'Content-Type': 'application/json'
            },
        }, function(error, pack){
            if (pack) {
                console.log("pack", pack);
                setEditTitleName(pack.title);
                setEditGenre(pack.genre);
                setPrice("$ "+pack.variants.edges[0].node.price);
                setEditDescription(pack.description);
                setPackId(pack.legacyResourceId);
                setImageSrc(pack.featuredImage.url);
                setProductId(pack.legacyResourceId);
            }
            else{
                console.error(error);
            }
            // setLoading(false);
        });
    }
    function getSamples(pack_id){
        console.log("pack_id", pack_id);
        Axios({
            type: "get",
            url: "/merchant/get_all_samples?shop="+store("shop")+"&product_id="+pack_id,
            headers: {
            'Content-Type': 'application/json'
            },
        }, function(error, data){
            if (data) {
                if(data){
                    console.log("samples: ", data);
                    setSamples(data);
                    // here(data);
                    // setTitleName(data.products.collections.title_name);
                    setLoading(false);
                }
                else{
                    setSamples([]);
                }
                // if(data && data.paginate){
                //     setPagination(data.paginate);    
                // }
            }
            else{
                setSamples([]);
                console.error(error);
            }
            // setLoading(false);  
        });
    }

    function back() {
        navigate("/", {replace: true});
        replace({pathname: '/'});
    }

    function deletePack(){
        console.log("_id",id);
        Axios({
            type: "delete",
            url: "/merchant/delete_pack?id="+id+"&shop="+store("shop"),
            headers: {
                'Content-Type': 'application/json'
            },
        }, function(error, pack){
            console.log("pack pack", pack);
            console.log("error", error);
            if (pack) {
                navigate("/", {replace: true});
                replace({pathname: '/'});
                show("Pack Deleted !");
            }
            else{
                console.error(error);
            }
            setLoading(false);
        });
    }

    function updatePackAPI(){
        var update_pack = {
            shop: store("shop"),
            title: edit_title_name,
            genre: edit_genre,
            price: edit_price,
            description: edit_description
        };
        Axios(
            {
                type: "put",
                url: "/merchant/update_pack?id=" + id,
                data: JSON.stringify(update_pack),
                headers: {
                    "Content-Type": "application/json",
                },
            },
            function (error, updated) {
                console.log("updated", updated);
                if (error) {
                    // setCreatingOffer(false);
                } else {
                    setEditingProduct(false);
                    setEditActive(true);
                    show("Pack Updated Successfully !");
                }
            }
        );
    }

    function createProductAPI() {
        setLoading(true);
        // const file_name = files[0].name;
        // console.log("files: ", files);
        show("Creating Pack !");
        setActive(false);

        setCreatingProduct(true);
        setPage(1);
        console.log("ss", files[0]);
        const fd = new FormData();
        if (files) {
            fd.append('image', files[0]);
        }

        fd.append('title', title_name);
        fd.append('description', description);
        fd.append('genre', genre);
        fd.append('shop', store("shop"));
        Axios(
            {
                type: "post",
                url: "/merchant/add_product",
                data: fd,
                // headers: {
                //     "Content-Type": "application/json",
                // },
            },
            function (error, success) {
                if (error) {
                    setUpdatingProduct(false);
                } else {
                    console.log("here");
                    console.log("success",success);
                    if (success && success.success && success.success._id) {
                        setCreatingProduct(false);
                        setActive(true);
                        show("Pack Created Successfully");
                        getProducts(1);
                        setProducts(false);
                        setLoading(false);
                    }
                }
            }
        );
    }

    function getProducts(page){
        Axios({
            type: "get",
            url: "/merchant/products?shop="+store("shop")+"&page="+page,
            headers: {
            'Content-Type': 'application/json'
            },
        }, function(error, data){
            if (data) {
                if(data && data.collections){
                    console.log("data.collections", data.collections);
                    setProducts(data.collections);
                }
                else{
                    setProducts([]);
                }
                if(data && data.paginate){
                    console.log("", data.paginate);
                    setPagination(data.paginate);    
                }
            } 
            else{
                setProducts([]);
                console.error(error);
            }
            setLoading(false);
        });
    }

    const searchIcon = <Icon source={SearchMinor} />;
    if (loading) {
        return (
            <Page fullWidth>
                <Card>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                </Card>
            </Page>
        )
    }

    // function here(samples){
        if(samples.length == 0){
            return (
                <div className='shephbeats-pack-page'>
                    <Page fullWidth>
                        <Frame topBar={topBarMarkup} logo={logo}>
                            <Layout>
                                <Layout.Section>
                                    <Card>
                                        <Card.Section>
                                            <div className="product-details-card">
                                                <MediaCard
                                                    description={
                                                        <span className="downloads-sales" style={{display:"flex"}}>
                                                            <span className="downloads">Downloads: <p className="downloads-k">5.55k</p></span>
                                                            <p className="sales">Sales: <p className="sales-k">$15.45k</p></p>
                                                        </span>
                                                    }
                                                >
                                                    <VideoThumbnail
                                                        thumbnailUrl={image_src}
                                                    />
                                                    <div className="product-details">
                                                        <span className="product-title">{edit_title_name}</span>
                                                        <div className="genre-price-edit">
                                                            <span className="product-genre">{edit_genre}</span>
                                                            <span className="product-price">{edit_price}</span>
                                                            <span className="product-edit" onClick={handleEditChange}>Edit Pack Details</span>
                                                        </div>
                                                        <div className="samples-left">
                                                            <span className="samples-text">*This pack can hold 250 samples, 20 added and 230 left</span>
                                                        </div>
                                                        <div className="product-description">
                                                            {edit_description}
                                                        </div>
                                                        <div className="add-delete-btns">
                                                            <ButtonGroup>
                                                                <Button primary onClick={handleAddSample}>+ Add Samples</Button>
                                                                <Button destructive onClick={deletePack}>Delete</Button>
                                                                <Button monochrome onClick={back}>Back</Button>
                                                            </ButtonGroup>
                                                        </div>
                                                    </div>
                                                </MediaCard>
                                                <p className="file-extension">png, jpg, svg, jpeg</p>
                                            </div>
                                        </Card.Section>
                                            <Card.Section>
                                                <EmptyState
                                                    heading="No Samples to show"
                                                    action={{ 
                                                    content: "+ Add Samples",
                                                    onAction: () => {
                                                    navigate("/add-samples/"+pack_id, {replace: true});
                                                    replace({pathname: "/add-samples/"+pack_id});
                                                }
                                                    }}
                                                    image={music_emptyState}
                                                >
                                                </EmptyState>
                                            </Card.Section>
                                    </Card>
                                </Layout.Section>
                            </Layout>
                        </Frame>
                    </Page>
                    <Modal
                        open={!active} 
                        onClose={handleChange}
                        title="PACK DETAILS"
                        primaryAction={{
                            content: 'Save',
                            onAction: () => {
                                setCreatingProduct(true);
                                createProductAPI();
                            },
                        }}
                    >
                        <div className="modal-class">
                            <Modal.Section>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <Stack vertical>
                                            <TextField
                                                label=""
                                                value={title_name}
                                                onChange={handleTitleName}
                                                placeholder="Pack Title"
                                            />
                                            {/* <Select
                                                label="Genre"
                                                labelHidden
                                                value={genre}
                                                onChange={handleGenre}
                                                options={[
                                                    {
                                                        label: "Products",
                                                        value: "products"
                                                    },
                                                    {
                                                        label: "Variants",
                                                        value: "variants"
                                                    }
                                                ]}
                                            /> */}
                                            <TextField
                                                type="number"
                                                label=""
                                                value={price}
                                                onChange={handlePrice}
                                                prefix="$"
                                                placeholder="Price"
                                                autoComplete="off"
                                            />
                                            <TextField
                                                value={description}
                                                onChange={handleDescription}
                                                multiline={4}
                                                autoComplete="off"
                                                placeholder="Descriptions"
                                            />
                                            <DropZone onDrop={handleDropZoneDrop}>
                                                {uploadedFiles}
                                                {fileUpload}
                                            </DropZone>
                                            <div className="clear_container">
                                                <Stack.Item>
                                                    <a className="imageClear">Clear</a>
                                                    <Image
                                                        source={closeImage}
                                                        width="9px"
                                                        height="9px"
                                                    />
                                                </Stack.Item>
                                            </div>
                                        </Stack>
                                    </FormLayout.Group>
                                </FormLayout>
                            </Modal.Section>
                        </div>
                    </Modal>
                    <Modal
                        open={!edit_active}
                        onClose={handleEditChange}
                        title="PACK DETAILS"
                        primaryAction={{
                            content: 'Update',
                            onAction: () => {
                                setUpdatingProduct(true);
                                updatePackAPI();
                            }, 
                        }}
                    >
                        <div className="modal-class">
                            <Modal.Section>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <Stack vertical>
                                            <TextField
                                                label=""
                                                value={edit_title_name}
                                                onChange={handleEditTitleName}
                                                placeholder="Pack Title"
                                            />
                                            {/* <Select
                                                label="Genre"
                                                labelHidden
                                                value={edit_genre}
                                                onChange={handleEditGenre}
                                                options={[
                                                    {
                                                        label: "Products",
                                                        value: "products"
                                                    },
                                                    {
                                                        label: "Variants",
                                                        value: "variants"
                                                    }
                                                ]}
                                            /> */}
                                            <TextField
                                                type="number"
                                                label=""
                                                value={edit_price}
                                                onChange={handleEditPrice}
                                                prefix="$"
                                                placeholder="Price"
                                                autoComplete="off"
                                            />
                                            <TextField
                                                value={edit_description}
                                                onChange={handleEditDescription}
                                                multiline={4}
                                                autoComplete="off"
                                                placeholder="Descriptions"
                                            />
                                            <DropZone onDrop={handleEditDropZoneDrop}>
                                                {editUploadedFiles}
                                                {editFileUpload}
                                            </DropZone>
                                            <div className="clear_container">
                                                <Stack.Item>
                                                    <a className="imageClear">Clear</a>
                                                    <Image
                                                        source={closeImage}
                                                        width="9px"
                                                        height="9px"
                                                    />
                                                </Stack.Item>
                                            </div>
                                        </Stack>
                                    </FormLayout.Group>
                                </FormLayout>
                            </Modal.Section>
                        </div>
                    </Modal>
                </div>
            )
        }
        else{
            return (
                <div className='shephbeats-pack-page'>
                    <Page fullWidth>
                        <Frame topBar={topBarMarkup} logo={logo}>
                            <Layout>
                                <Layout.Section>
                                    <Card>
                                        <Card.Section>
                                            <div className="product-details-card">
                                                <MediaCard
                                                    description={
                                                        <span className="downloads-sales" style={{display:"flex"}}>
                                                            <span className="downloads">Downloads: <p className="downloads-k">5.55k</p></span>
                                                            <p className="sales">Sales: <p className="sales-k">$15.45k</p></p>
                                                        </span>
                                                    }
                                                >
                                                    <VideoThumbnail
                                                        thumbnailUrl={image_src}
                                                    />
                                                    <div className="product-details">
                                                        <span className="product-title">{edit_title_name}</span>
                                                        <div className="genre-price-edit">
                                                            <span className="product-genre">{edit_genre}</span>
                                                            <span className="product-price">{edit_price}</span>
                                                            <span className="product-edit" onClick={handleEditChange}>Edit Pack Details</span>
                                                        </div>
                                                        <div className="samples-left">
                                                            <span className="samples-text">*This pack can hold 250 samples, 20 added and 230 left</span>
                                                        </div>
                                                        <div className="product-description">
                                                            {edit_description}
                                                        </div>
                                                        <div className="add-delete-btns">
                                                            <ButtonGroup>
                                                                <Button primary onClick={handleAddSample}>+ Add Samples</Button>
                                                                <Button destructive onClick={deletePack}>Delete</Button>
                                                                <Button monochrome onClick={back}>Back</Button>
                                                            </ButtonGroup>
                                                        </div>
                                                    </div>
                                                </MediaCard>
                                                <p className="file-extension">png, jpg, svg, jpeg</p>
                                            </div>
                                        </Card.Section>
                                        <Card.Section>
                                            <Stack vertical spacing="extraLoose">
                                            <Stack.Item>
                                                <div className="sephbeats-filters">
                                                    <div className="sephbeats-filter-search">
                                                        <TextField
                                                            labelHidden
                                                            label="Search"
                                                            prefix={<Icon source={SearchMajor}></Icon>}
                                                            value={searchValue}
                                                            onChange={searchInputOnChange}
                                                            placeholder="Filter"
                                                        />
                                                    </div>
                                                    <div className="sephbeats-filter-action">
                                                        <Select
                                                            labelHidden
                                                            label="Search Type"
                                                            value={searchType}
                                                            onChange={searchTypeOnChange}
                                                            placeholder="Action"
                                                            options={[
                                                            {
                                                                label: "Active",
                                                                value: "active"
                                                            },
                                                            {
                                                                label: "Draft",
                                                                value: "draft"
                                                            },
                                                            {
                                                                label: "Delete",
                                                                value: "delete"
                                                            }
                                                            ]}
                                                        />
                                                    </div>
                                                    <div className="sephbeats-filter-bpm">
                                                        <div>
                                                            <Popover
                                                                active={popoverActive}
                                                                activator={<Button onClick={togglePopoverActive} disclosure>
                                                                BPM
                                                            </Button>}
                                                                autofocusTarget="first-node"
                                                                onClose={togglePopoverActive}
                                                            >
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                    <div className="sephbeats-filter-key">
                                                    <Popover
                                                            active={popoverActive}
                                                            activator={<Button onClick={togglePopoverActive} disclosure>
                                                            Type
                                                        </Button>}
                                                            autofocusTarget="first-node"
                                                            onClose={togglePopoverActive}
                                                        >
                                                        </Popover>
                                                    </div>
                                                    <div className="sephbeats-filter-sort">
                                                        <Select
                                                            labelHidden
                                                            label="Search Type"
                                                            value={searchType}
                                                            onChange={searchTypeOnChange}
                                                            placeholder="Sort"
                                                            options={[]}
                                                        />
                                                    </div>
                                                </div>
                                            </Stack.Item>
                                            <Stack.Item>
                                                <DataProductsTable
                                                    searchValue={searchValue}
                                                    rows={samples}
                                                    products={samples}
                                                    callback={(f_products) => {
                                                        setSamples(f_products);
                                                        setLoading(true);
                                                    }}
                                                    onEditClick={() => {
                                                        setLoading(false);
                                                        setPage(1);
                                                        getSamples();
                                                    }}
                                                    onDeleteClick={(item) => {
                                                        console.log("item", item);
                                                        setDeleteSampleId(item.node.id.split("gid://shopify/ProductVariant/")[1]);
                                                        setDeleteModalActive(true);
                                                      }}
                                                ></DataProductsTable>
                                            </Stack.Item>
                                            </Stack>
                                        </Card.Section>
                                    </Card>
                                </Layout.Section>
                                <Layout.Section>
                                    <Stack alignment="center" distribution="center">
                                    <Pagination
                                        hasNext={pagination.next_page}
                                        hasPrevious={pagination.prev_page}
                                        onNext={() => {
                                        var nxt_pg = current_page + 1;
                                        setPage(nxt_pg);
                                        getProducts(nxt_pg);
                                        }}
                                        onPrevious={() => {
                                        var prv_pg = current_page - 1;
                                        setPage(prv_pg);
                                        getProducts(prv_pg);
                                        }}
                                    ></Pagination>
                                    </Stack>
                                </Layout.Section>
                                <Layout.Section></Layout.Section>
                            </Layout>
                        </Frame>
                    </Page>
                    <Modal
                        open={!active} 
                        onClose={handleChange}
                        title="PACK DETAILS"
                        primaryAction={{
                            content: 'Save',
                            onAction: () => {
                                setCreatingProduct(true);
                                createProductAPI();
                            },
                        }}
                    >
                        <div className="modal-class">
                            <Modal.Section>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <Stack vertical>
                                            <TextField
                                                label=""
                                                value={title_name}
                                                onChange={handleTitleName}
                                                placeholder="Pack Title"
                                            />
                                            {/* <Select
                                                label="Genre"
                                                labelHidden
                                                value={genre}
                                                onChange={handleGenre}
                                                options={[
                                                    {
                                                        label: "Products",
                                                        value: "products"
                                                    },
                                                    {
                                                        label: "Variants",
                                                        value: "variants"
                                                    }
                                                ]}
                                            /> */}
                                            <TextField
                                                type="number"
                                                label=""
                                                value={price}
                                                onChange={handlePrice}
                                                prefix="$"
                                                placeholder="Price"
                                                autoComplete="off"
                                            />
                                            <TextField
                                                value={description}
                                                onChange={handleDescription}
                                                multiline={4}
                                                autoComplete="off"
                                                placeholder="Descriptions"
                                            />
                                            <DropZone onDrop={handleDropZoneDrop}>
                                                {uploadedFiles}
                                                {fileUpload}
                                            </DropZone>
                                            <div className="clear_container">
                                                <Stack.Item>
                                                    <a className="imageClear">Clear</a>
                                                    <Image
                                                        source={closeImage}
                                                        width="9px"
                                                        height="9px"
                                                    />
                                                </Stack.Item>
                                            </div>
                                        </Stack>
                                    </FormLayout.Group>
                                </FormLayout>
                            </Modal.Section>
                        </div>
                    </Modal>
                    <Modal
                        open={!edit_active}
                        onClose={handleEditChange}
                        title="PACK DETAILS"
                        primaryAction={{
                            content: 'Update',
                            onAction: () => {
                                setUpdatingProduct(true);
                                updatePackAPI();
                            }, 
                        }}
                    >
                        <div className="modal-class">
                            <Modal.Section>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <Stack vertical>
                                            <TextField
                                                label=""
                                                value={edit_title_name}
                                                onChange={handleEditTitleName}
                                                placeholder="Pack Title"
                                            />
                                            {/* <Select
                                                label="Genre"
                                                labelHidden
                                                value={edit_genre}
                                                onChange={handleEditGenre}
                                                options={[
                                                    {
                                                        label: "Products",
                                                        value: "products"
                                                    },
                                                    {
                                                        label: "Variants",
                                                        value: "variants"
                                                    }
                                                ]}
                                            /> */}
                                            <TextField
                                                type="number"
                                                label=""
                                                value={edit_price}
                                                onChange={handleEditPrice}
                                                prefix="$"
                                                placeholder="Price"
                                                autoComplete="off"
                                            />
                                            <TextField
                                                value={edit_description}
                                                onChange={handleEditDescription}
                                                multiline={4}
                                                autoComplete="off"
                                                placeholder="Descriptions"
                                            />
                                            <DropZone onDrop={handleEditDropZoneDrop}>
                                                {editUploadedFiles}
                                                {editFileUpload}
                                            </DropZone>
                                            <div className="clear_container">
                                                <Stack.Item>
                                                    <a className="imageClear">Clear</a>
                                                    <Image
                                                        source={closeImage}
                                                        width="9px"
                                                        height="9px"
                                                    />
                                                </Stack.Item>
                                            </div>
                                        </Stack>
                                    </FormLayout.Group>
                                </FormLayout>
                            </Modal.Section>
                        </div>
                    </Modal>
                    {
        delete_modal_active &&
        <Modal
          
          open={true}
          title="Delete Sample"
          onClose={() => {
            setDeleteModalActive(false);
          }}
          primaryAction={[
            {
              loading: deleting_sample,
              content: 'Delete',
              onAction: () => {
                DeleteSample();
              }
            },
          ]}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => {
                setDeleteModalActive(false);
              }
            },
          ]}
        >
          <Modal.Section>
            Are you sure to Delete Sample ?
          </Modal.Section>
        </Modal>
      }
                </div>
            )
        }
    // }
}

function DataProductsTable({rows, searchType, searchValue, samples, callback, onUpdate, onDeleteClick}) {
    const navigate = useNavigate();
    const {replace} = useNavigationHistory();
    if (!rows || typeof rows !== "object") {
      rows = [];
    }
    if (searchValue && searchValue.trim() !== "") {
      try {
        rows = rows.filter(x =>x.node.title.match(new RegExp(searchValue, "gi")));
      } catch (e) {
        
      }
    }
    return (
      <DataTable
        rows={rows.map((row) => [
            <div className="sephbeats-thumbnail-title" style={{display: "flex"}}>
                { row && row.node && row.node.image && row.node.image.url  ? (
                    <Thumbnail
                        source={row.node.image.url}
                        size="small"
                        alt="Black choker necklace"
                    />
                ) : (
                    <Thumbnail
                        source={music1}
                        size="small"
                        alt="Black choker necklace"
                    />
                )}
                <span className="sephbeats-thumbnail-text">{row.node.title}</span>
            </div>,
            <div>
                <span>{row.node.price || 0}</span>
            </div>,
            <div className="sephbeats-downloads-icon">
                <Icon source={FolderDownMajor} color="base"/><span className="downloads-text">500</span>
            </div>,
            <div>
                <span>{row.node.price || 0}K</span>
            </div>,
            <ButtonGroup segmented>
                <Badge status="success">Active</Badge>
            </ButtonGroup>,
            <ButtonGroup segmented>
            <Button
              icon={EditMajor}
              onClick={() => {
                  navigate("/sample/edit/"+row.node.id.split("gid://shopify/ProductVariant/")[1]);
                  replace({pathname: '/sample/edit/'+row.node.id.split("gid://shopify/ProductVariant/")[1]});
              }}
            />
            <Button
              icon={DeleteMajor}
              onClick={() => {
                if (typeof onDeleteClick === "function") {
                  onDeleteClick(row);
                }
              }}
            />
          </ButtonGroup>
            
        ])}
        columnContentTypes={[
          'text',
          'text',
          'text',
          'text',
          'text'
        ]}
        headings={[
          'Samples',
          'Price',
          'Downloads',
          'Sales', 
          'Status',
          'Action'
          
        ]}
      ></DataTable>
    );
}

const fake_products = [
    {
        "_id": "628266dc423a82ea3bb737b9",
        "store_id": 123,
        "product_id": 134124,
        "ab_testing": false,
        "active": true,
        "start_date": "2020-01-01T05:00:00.000Z",
        "product_name" : "zzzzzzz",
        "placement_type" : "zzzzzzz",
        "priority" : "5",
        "run_name": "first run",
        "upsell": {
            "views": 9,
            "matchings": [
                {
                    "product_id": 141414,
                    "clicks": 4
                },
                {
                    "product_id": 151515,
                    "clicks": 0
                }
            ]
        }
    },
    {
        "_id": "6282706c8ad9322c7a8e661a",
        "store_id": 123,
        "product_id": 134123,
        "ab_testing": true,
        "active": true,
        "product_name" : "zzzzzzz",
        "start_date": "2020-01-01T05:00:00.000Z",
        "placement_type" : "zzzzzzz",
        "priority" : "5",
        "run_name": "first run",
        "upsell": [
            {
                "views": 10,
                "matchings": [
                    {
                        "clicks": 0,
                        "product_id": 151515
                    },
                    {
                        "clicks": 1,
                        "product_id": 141414
                    }
                ]
            },
            {
                "views": 9,
                "matchings": [
                    {
                        "clicks": 2,
                        "product_id": 616161
                    },
                    {
                        "clicks": 0,
                        "product_id": 414141
                    },
                    {
                        "clicks": 0,
                        "product_id": 515151
                    }
                ]
            }
        ]
    }
    ];

const default_pagination = {
next_page: null,
prev_page: null,
total_records: 10
};