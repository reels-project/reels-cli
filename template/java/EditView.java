package <%- packageName %>.view;

import java.io.Serializable;

import javax.faces.view.ViewScoped;
import javax.inject.Named;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import <%- packageName %>.model.<%-targetName2%>Model;

@ViewScoped
@Named
@SuppressWarnings("serial")
public class <%-targetName2%>EditView implements Serializable{
	
	@PersistenceContext
	private EntityManager em;
	
	private <%-targetName2%>Model model;
	
	private Long id;
	
	public void setId(Long id){
		this.id = id;
	}
	public Long getId(){
		return this.id;
	}
	
	public <%-targetName2%>Model getModel(){
		return model;
	}
	
	
	public void init(){
		model = em.find(<%-targetName2%>Model.class, id);
	}
	
	@Transactional
	public String edit(){
		<%-targetName2%>Model m = em.find(<%-targetName2%>Model.class, model.getId());
		m.setName(model.getName());
		em.merge(m);
		
		return "/views/<%-targetName%>/list.xhtml?faces-redirect=true";
	}
}
