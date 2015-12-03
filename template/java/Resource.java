package <%- packageName %>.resource;

import java.net.URI;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Named;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import <%- packageName %>.model.SampleModel;

@Path("<%- targetName %>")
@Produces(MediaType.APPLICATION_JSON)
@RequestScoped
@Named
public class Resource {
	
	@PersistenceContext
	private EntityManager em;
	
	@GET
	public List<<%- targetName2 %>Model> all(){
		return em.createQuery("select s from <%- targetName2 %>Model s",<%- targetName2 %>Model.class).getResultList();
	}
	
	@GET
	@Path("{id}")
	public <%- targetName2 %>Model find(@PathParam("id") Long id){
		return em.find(<%- targetName2 %>Model.class, id);
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Transactional
	public Response create(@Valid <%- targetName2 %>Model model){
		em.persist(model);
		return Response.created(URI.create(model.getId().toString())).build();
	}
	
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Transactional
	public Response save(@Valid <%- targetName2 %>Model model){
		<%- targetName2 %>Model m = em.find(<%- targetName2 %>Model.class, model.getId());
		//TODO つめかえ
		em.merge(m);
		return Response.noContent().build();
	}
	
	@DELETE
	@Path("{id}")
	@Transactional
	public Response delete(@PathParam("id") Long id){
		<%- targetName2 %>Model m = em.find(<%- targetName2 %>Model.class,id);
		if(m != null){
			em.remove(m);
		}
		return Response.noContent().build();
	}
}
