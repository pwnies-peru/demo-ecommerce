CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brand (
    id character varying(36) NOT NULL,
    name character varying(200) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.brand OWNER TO postgres;

--
-- Name: canonical_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.canonical_product (
    id character varying(36) NOT NULL,
    name character varying(300),
    slug character varying(300),
    normalized_name character varying(300),
    ean character varying(128),
    brand_id character varying(36),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.canonical_product OWNER TO postgres;

--
-- Name: price_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_history (
    id character varying(36) NOT NULL,
    store_product_id character varying(36) NOT NULL,
    price double precision NOT NULL,
    list_price double precision,
    is_available boolean,
    note text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.price_history OWNER TO postgres;

--
-- Name: promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion (
    id character varying(36) NOT NULL,
    name character varying(256) NOT NULL,
    value character varying(256) NOT NULL,
    raw_value text,
    store_id character varying(36),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.promotion OWNER TO postgres;

--
-- Name: store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store (
    id character varying(36) NOT NULL,
    name character varying(150) NOT NULL,
    slug character varying(150),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.store OWNER TO postgres;

--
-- Name: store_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_category (
    id character varying(36) NOT NULL,
    store_id character varying(36) NOT NULL,
    id_engine character varying(256),
    name character varying(200) NOT NULL,
    slug character varying(200),
    last_scraped_at timestamp with time zone,
    needs_refresh boolean NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.store_category OWNER TO postgres;

--
-- Name: store_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_product (
    id character varying(36) NOT NULL,
    canonical_id character varying(36),
    identity_hash character varying NOT NULL,
    store_id character varying(36) NOT NULL,
    id_engine character varying(256),
    name character varying(300),
    slug character varying(300),
    ean character varying(128),
    online_price double precision,
    list_price double precision,
    is_available boolean,
    stock_quantity integer,
    link text,
    add_to_cart_link text,
    image_url text,
    brand_image_url text,
    brand_id character varying(36),
    last_scraped_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.store_product OWNER TO postgres;

--
-- Name: store_product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_product_category (
    store_product_id character varying(36) NOT NULL,
    store_category_id character varying(36) NOT NULL
);


ALTER TABLE public.store_product_category OWNER TO postgres;

--
-- Name: store_product_promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_product_promotion (
    store_product_id character varying(36) NOT NULL,
    promotion_id character varying(36) NOT NULL
);


ALTER TABLE public.store_product_promotion OWNER TO postgres;

CREATE TABLE public.shopping_cart_item (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    store_id varchar(36) NOT NULL REFERENCES public.store(id) ON DELETE CASCADE,
    store_product_id varchar(36) NOT NULL REFERENCES public.store_product(id) ON DELETE CASCADE,

    quantity integer NOT NULL CHECK (quantity > 0),

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    -- Ensure one product per user (prevents duplicates)
    CONSTRAINT shopping_cart_item_user_product_unique UNIQUE (user_id, store_product_id)
);

-- Function to upsert cart items (add or update quantity)
CREATE OR REPLACE FUNCTION upsert_cart_item(
    p_user_id uuid,
    p_store_id varchar(36),
    p_store_product_id varchar(36),
    p_quantity_to_add integer DEFAULT 1
)
RETURNS TABLE (
    cart_id uuid,
    cart_user_id uuid,
    cart_store_id varchar(36),
    cart_store_product_id varchar(36),
    cart_quantity integer,
    cart_created_at timestamptz,
    cart_updated_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO shopping_cart_item (user_id, store_id, store_product_id, quantity)
    VALUES (p_user_id, p_store_id, p_store_product_id, p_quantity_to_add)
    ON CONFLICT (user_id, store_product_id)
    DO UPDATE SET
        quantity = shopping_cart_item.quantity + p_quantity_to_add,
        updated_at = now()
    RETURNING
        shopping_cart_item.id,
        shopping_cart_item.user_id,
        shopping_cart_item.store_id,
        shopping_cart_item.store_product_id,
        shopping_cart_item.quantity,
        shopping_cart_item.created_at,
        shopping_cart_item.updated_at;
END;
$$;

-- Function to set cart item quantity (replace, not add)
CREATE OR REPLACE FUNCTION set_cart_item_quantity(
    p_user_id uuid,
    p_store_product_id varchar(36),
    p_quantity integer
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_quantity <= 0 THEN
        -- Remove item if quantity is 0 or less
        DELETE FROM shopping_cart_item
        WHERE user_id = p_user_id AND store_product_id = p_store_product_id;
    ELSE
        -- Update quantity
        UPDATE shopping_cart_item
        SET quantity = p_quantity, updated_at = now()
        WHERE user_id = p_user_id AND store_product_id = p_store_product_id;
    END IF;
END;
$$;
