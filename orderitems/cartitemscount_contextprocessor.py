def cartItemsCount(request):
    cartItems = request.session.get('cartItems')
    if cartItems is not None:
        return {'cart_items_count':len(cartItems)}
    else:
        return {'cart_items_count':0}